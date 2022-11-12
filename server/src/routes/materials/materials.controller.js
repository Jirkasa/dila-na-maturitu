const { validationResult } = require("express-validator");
const { Op, QueryTypes } = require("sequelize");
const { ValidMaterialPartNames, getPagination, processMaterialData } = require("../../helpers");
const Like = require("../../models/like.model");
const Material = require("../../models/material.model");
const User = require("../../models/user.model");
const sequelize = require("../../services/database");
const jwt = require("jsonwebtoken");

// POST - MATERIALS
// used to create new material
async function postMaterials(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send one of them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
        });
    }

    // get data from body
    const title = req.body.title;
    const author = req.body.author;
    const materialDataString = req.body.materialData;

    // parse material data to JS object
    let materialData;
    try {
        materialData = JSON.parse(materialDataString);
        // if parsed JSON is not Array, error is sent
        if (!(materialData instanceof Array)) return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    } catch(err) {
        // if material data can't be parsed, error is sent
        return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    }

    // here will be stored processed material data
    let data;
    // here will be stored whether material is testable or not
    let testable;

    try {
        // process material data
        const result = processMaterialData(materialData);
        // get processed material data
        data = result.data;
        // get whether material is testable or not
        testable = result.testable;
    
        // if there are no material data, error is sent
        if (data.length === 0) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });

        // check whether all sections in material data are empty or not
        let allSectionsEmpty = true;
        for (let section of data) {
            if (section.content.length !== 0) {
                allSectionsEmpty = false;
                break;
            }
        }
        // if all sections in material data are empty, error is sent
        if (allSectionsEmpty) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    }

    // store material in database
    try {
        await Material.create({
            title: title,
            author: author,
            materialData: JSON.stringify(data),
            testable: testable,
            materialAuthorId: req.user.id
        });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    }

    // inform user that material was successfully stored in database
    return res.status(201).json({});
}

// GET - MATERIALS
// used to get materials (pagination is used)
async function getMaterials(req, res) {
    // get search text from query object (if user want's to search material)
    const searchText = req.query.search || "";

    // get user id (if user is logged in)
    const loggedInUserId = await new Promise((resolve, reject) => {
        // get access token from authorization header
        const accessToken = req.headers.authorization;
        // if access token wasn't passed, user is not logged in
        if (!accessToken || !accessToken.split(" ")[1]) return resolve(null);

        // verify access token
        jwt.verify(accessToken.split(" ")[1], process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            // if verification failed, access token is not valid and user is not logged in
            if (err) return resolve(null);
            // user is logged in, his user id was obtained from access token
            return resolve(user.id);
        });
    });

    // count number of materials in database
    let rowCount;
    try {
        rowCount = await Material.count({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `${searchText}%`
                        }
                    },
                    {
                        author: {
                            [Op.like]: `${searchText}%`
                        }
                    }
                ]
            }
        });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }

    // get pagination result
    const pagination = await getPagination(req.query, rowCount);

    try {
        // here will be stored materials fetched from database
        let materials;

        if (loggedInUserId !== null) {
            // if user is logged in, materials are fetched from database with info about whether user likes material or not
            if (process.env.USE_POSTGRESS === "true") {
                materials = await sequelize.query(`
                SELECT
                    \`material\`.\`id\`, \`material\`.\`title\`, \`material\`.\`author\`, \`material\`.\`testable\`, \`user\`.\`username\` AS \`user.username\`, \`likes\`.\`userId\` IS NOT NULL AS "liked"
                FROM \`materials\` AS \`material\`
                LEFT OUTER JOIN
                    \`users\` AS \`user\` ON \`material\`.\`materialAuthorId\` = \`user\`.\`id\`
                LEFT OUTER JOIN
                    \`likes\` ON \`likes\`.\`userId\` = :userId AND \`material\`.\`id\` = \`likes\`.\`materialId\`
                WHERE (\`material\`.\`title\` LIKE :search OR \`material\`.\`author\` LIKE :search)
                ORDER BY \`material\`.\`title\` ASC, \`material\`.\`id\` ASC LIMIT :skip, :limit;
                `, {
                    replacements: {
                        search: searchText+"%",
                        skip: pagination.skip,
                        limit: pagination.limit,
                        userId: loggedInUserId
                    },
                    type: QueryTypes.SELECT
                });
            } else {
                // - previously, Postgress was used on Heroku, but it is no longer free
                materials = await sequelize.query(`
                SELECT
                    "material"."id", "material"."title", "material"."author", "material"."testable", "user"."username" AS "user.username", "likes"."userId" IS NOT NULL AS "liked"
                FROM "materials" AS "material"
                LEFT OUTER JOIN
                    "users" AS "user" ON "material"."materialAuthorId" = "user"."id"
                LEFT OUTER JOIN
                    "likes" ON "likes"."userId" = :userId AND "material"."id" = "likes"."materialId"
                WHERE ("material"."title" LIKE :search OR "material"."author" LIKE :search)
                ORDER BY "material"."title" ASC, "material"."id" ASC LIMIT :limit OFFSET :skip;
                `, {
                    replacements: {
                        search: searchText+"%",
                        skip: pagination.skip,
                        limit: pagination.limit,
                        userId: loggedInUserId
                    },
                    type: QueryTypes.SELECT
                });
            }
        } else {
            // if user is not logged in, materials are fetched from database without info about whether user likes material or not
            materials = await Material.findAll({
                attributes: ["id", "title", "author", "testable"],
                offset: pagination.skip,
                limit: pagination.limit,
                where: {
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: `${searchText}%`
                            }
                        },
                        {
                            author: {
                                [Op.like]: `${searchText}%`
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: User,
                        attributes: ["username"]
                    },
                ],
                order: [
                    ["title", "ASC"],
                    ["id", "ASC"] // this is needed because if more rows have same title, they can appear twice in more pages
                ],
                raw: true
            });
        }

        // send material to client
        return res.status(200).json({
            materials: materials,
            page: pagination.page,
            pageSize: pagination.limit,
            pageCount: pagination.pageCount
        });
    } catch(err) {
        console.log(err);
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// GET - MATERIAL BY ID
// used to get material by ID
async function getMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({});

    // check whether wrong answers shoud be included in response
    const includeWrongAnswers = req.query.includeWrongAnswers === "true";
    // check whether not to include material data
    const dontIncludeMaterialData = req.query.dontIncludeMaterialData === "true";

    // set attributes to be retrieved from database
    let attributes = ["id", "title", "author", "materialData", "testable"];
    if (includeWrongAnswers) attributes.push("wrongAnswers");
    if (dontIncludeMaterialData) attributes = attributes.filter(attr => attr !== "materialData");

    try {
        // fetch material from database
        const material = await Material.findOne({
            attributes: attributes,
            where: {
                id: materialId
            },
            include: [{
                model: User,
                attributes: ["username", "id"]
            }],
            raw: true
        });
        // if material wasn't found, error is sent
        if (!material) return res.status(404).json({});

        // send material to client
        return res.status(200).json({ material: material });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// PATCH - MATERIAL BY ID
// used to update material by ID
async function patchMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({ error: "Nebylo předáno ID materiálu." });

    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send one of them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
        });
    }

    // get data from body
    const title = req.body.title;
    const author = req.body.author;
    const materialDataString = req.body.materialData;

    // parse material data to JS object
    let materialData;
    try {
        materialData = JSON.parse(materialDataString);
        // if parsed JSON is not Array, error is sent
        if (!(materialData instanceof Array)) return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    } catch(err) {
        // if material data can't be parsed, error is sent
        return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    }

    // here will be stored processed material data
    let data;
    // here will be stored wheter material is testable or not
    let testable;
    // here will be stored what section parts are included in material
    let includedSectionParts;

    try {
        // process material data
        const result = processMaterialData(materialData);
        // get processed material data
        data = result.data;
        // get whether material is testable or not
        testable = result.testable;
        // get map of section parts that are included in material
        includedSectionParts = result.includedSectionParts;
    
        // if there are no material data, error is sent
        if (data.length === 0) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
        // check whether all sections in material data are empty or not
        let allSectionsEmpty = true;
        for (let section of data) {
            if (section.content.length !== 0) {
                allSectionsEmpty = false;
                break;
            }
        }
        // if all sections in material data are empty, error is sent
        if (allSectionsEmpty) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
    } catch(err) {
        // if someting went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    // get material from database
    let material;
    try {
        material = await Material.findOne({
            where: {
                id: materialId
            }
        });
        // if material wasn't found in database, error is sent
        if (!material) return res.status(404).json({ error: "Materiál pro aktualizaci nebyl nalezen." });
        // if user doesn't have right to update this material, error is sent
        if (material.materialAuthorId !== req.user.id) return res.status(403).json({ error: "Pro aktualizaci tohoto materiálu nemáš oprávnění." });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    try {
        // parse wrong answers of material
        const wrongAnswers = JSON.parse(material.wrongAnswers);
        // if material has wrong answers
        if (wrongAnswers) {
            // for each wrong answers
            for (let i = 0; i < wrongAnswers.length; i++) {
                // if wrong answers are for section, that was removed
                if (!includedSectionParts[wrongAnswers[i].name]) {
                    // remove wrong answers from wrongAnswers array
                    wrongAnswers.splice(i, 1);
                    i--;
                }
            }
            // set material wrong answers to be saved
            material.wrongAnswers = JSON.stringify(wrongAnswers);
            // if material is not testable yet and can be, testable is set true
            if (!testable && wrongAnswers.length > 0) testable = true;
        }
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    try {
        // set new material properties
        material.title = title;
        material.author = author;
        material.materialData = JSON.stringify(data);
        material.testable = testable;
        // save material to database
        await material.save();

        // inform user that material was succesfully updated
        return res.status(201).json({});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }
}

// PUT - MATERIAL WRONG ANSWERS BY ID
// used to update material wrong answers by material ID
async function putMaterialWrongAnswersById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({ error: "Nebylo předáno ID materiálu." });

    // get wrong answers from body
    const wrongAnswersString = req.body.wrongAnswers;
    // if wrong answers weren't passed, error is sent
    if (!wrongAnswersString) return res.status(400).json({ error: "Nebyly předány žádné špatné odpovědi k aktualizaci." });

    // parse wrong answers to JS object
    let wrongAnswers;
    try {
        wrongAnswers = JSON.parse(wrongAnswersString);
        // if parsed JSON is not Array, error is sent
        if (!(wrongAnswers instanceof Array)) return res.status(400).json({ error: "Špatné odpovědi byly poslány ve špatném formátu." });
    } catch(err) {
        // if wrong answers can't be parsed, error is sent
        return res.status("400").json({ error: "Špatné odpovědi byly poslány ve špatném formátu." });
    }

    // Validate wrong answers
    // - for each wrong answers
    for (let i = 0; i < wrongAnswers.length; i++) {
        // validate wrong answers
        if (
            (typeof wrongAnswers[i] !== 'object') ||
            (typeof wrongAnswers[i].name !== 'string') ||
            (wrongAnswers[i].name === "Postavy") ||
            (wrongAnswers[i].name === "Děj") ||
            (!ValidMaterialPartNames[wrongAnswers[i].name])
        ) {
            // if validation failed, wrong answers are removed from wrongAnswers array
            wrongAnswers.splice(i, 1);
            i--;
            continue;
        }

        // for each wrong answer of wrong answers
        for (let j = 0; j < wrongAnswers[i].answers.length; j++) {
            // get answer
            let answer = wrongAnswers[i].answers[j];
            // validate answer
            if (
                (typeof answer !== 'string') ||
                (answer === "")
            ) {
                // if validation failed, answer is removed
                wrongAnswers[i].answers.splice(j, 1);
                j--;
            }
        }

        // if there are no answers left for these wrong answers, they are removed
        if (wrongAnswers[i].answers.length === 0) {
            wrongAnswers.splice(i, 1);
            i--;
        }
    }

    try {
        // get material from database by ID
        const material = await Material.findOne({
            where: {
                id: materialId
            }
        });
        // if material wasn't found, error is sent
        if (!material) return res.status(404).json({ error: "Materiál pro aktualizaci špatných odpovědí nebyl nalezen." });
        // if user doesn't have right to update wrong answers for this material, error is sent
        if (material.materialAuthorId !== req.user.id) return res.status(403).json({ error: "Pro aktualizaci špatných opdovědí pro tento materiál nemáš oprávnění." });

        // if there are no wrong answers for material, for material must be determined whether it is testable or not
        if (wrongAnswers.length === 0) {
            // get (parse) material data
            const materialData = JSON.parse(material.materialData);
            // this variable will hold the result of whether the material is testable or not
            let testable = false;
            // for each section of material data
            for (let section of materialData) {
                // for each part of section
                for (let part of section.content) {
                    // if part of material is of type CHARACTERS or PLOT, and has at least two items, material is considered testable
                    if (
                        (part.name === "Postavy" && part.characters.length > 1) ||
                        (part.name === "Děj" && part.plot.length > 1)
                    ) {
                        testable = true;
                        break;
                    }
                }
                if (testable) break;
            }
            // change testable property of material
            material.testable = testable;
        } else {
            // if there are wrong answers for this material, material is considered testable
            material.testable = true;
        }

        // set wrong answers of material
        material.wrongAnswers = JSON.stringify(wrongAnswers);

        // save material to database
        await material.save();
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({ error: "Špatné odpovědi se bohužel nepovedlo aktualizovat." });
    }

    // inform user that wrong answers for this material were updated
    return res.status(201).json({});
}

// DELETE - MATERIAL BY ID
// used to delete material by id
async function deleteMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({});

    try {
        // get material from database
        const material = await Material.findOne({
            where: {
                id: materialId
            }
        });
        // if material wasn't found, error is sent
        if (!material) return res.status(404).json({});
        // if user doesn't have right to delete this material, error is sent
        if (material.materialAuthorId !== req.user.id) return res.status(403).json({});

        // remove material from database
        await material.destroy();
        // inform user, that material was succesfully delete from database
        return res.status(204).json({});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// POST - LIKE MATERIAL BY ID
// used to like material by ID
async function postLikeMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({});

    try {
        // like material (create item in likes table)
        await Like.create({
            userId: req.user.id, // user with ID likes
            materialId: materialId // material with ID
        });
        // inform user that he succesfully liked material
        return res.status(204).json({});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// DELETE - LIKE MATERIAL BY ID
// used to unlike material by ID
async function deleteLikeMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({});

    try {
        // unlike material (remove item from likes table)
        await Like.destroy({
            where: {
                userId: req.user.id, // user with ID unlikes
                materialId: materialId // material with ID
            }
        });
        // inform user that he succesfully unliked material
        return res.status(204).json({});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

module.exports = {
    postMaterials,
    getMaterials,
    getMaterialById,
    patchMaterialById,
    putMaterialWrongAnswersById,
    deleteMaterialById,
    postLikeMaterialById,
    deleteLikeMaterialById
}