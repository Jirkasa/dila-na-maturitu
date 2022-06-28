const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { ValidMaterialPartNames, getPagination, processMaterialData } = require("../../helpers");
const Material = require("../../models/material.model");
const User = require("../../models/user.model");

// ADD NEW MATERIAL
async function postMaterials(req, res) {
    // check if there are any errors from validation
    const errors = validationResult(req);
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
        // if parsed JSON is not Array, send error
        if (!(materialData instanceof Array)) return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    } catch(err) {
        return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    }


    // // here will be stored material data to be stored in database
    // const data = [];
    // // here will be stored whether material is testable or not
    // let testable = false;
    // try {
    //     // for each section of material data
    //     for (let section of materialData) {
    //         // validate section
    //         if (typeof section !== 'object') continue;
    //         if (!section.heading || (section.heading !== "Analýza uměleckého textu" && section.heading !== "Literárněhistorický kontext")) continue;
    //         if (!section.content || !(section.content instanceof Array)) continue;

    //         // here will be stored section data
    //         const sectionData = {
    //             heading: section.heading,
    //             content: []
    //         }

    //         // for each part of section
    //         for (let part of section.content) {
    //             // validate part of section
    //             if (typeof part !== 'object') continue;
    //             if (!part.checked) continue;
    //             if (typeof part.name !== "string") continue;
    //             if (!ValidMaterialPartNames[part.name]) continue;

    //             // here will be stored section part data
    //             const partData = {
    //                 name: part.name
    //             }

    //             // do appropriate action based on type of section part
    //             switch (part.type) {
    //                 case "TEXTAREA":
    //                     // if section part contains information about text area rows, it will be stored
    //                     if (part.textAreaRows && typeof part.textAreaRows === "number") {
    //                         partData.textAreaRows = part.textAreaRows;
    //                     }
    //                 case "TEXT":
    //                     // validate value of section part
    //                     if (!part.value || typeof part.value !== "string") continue;
    //                     // store value and type of section part
    //                     partData.value = part.value;
    //                     partData.type = part.type;
    //                     break;
    //                 case "CHARACTERS":
    //                     // validate characters array
    //                     if (!part.characters || !(part.characters instanceof Array)) continue;

    //                     // here will be stored characters of section part
    //                     const characters = [];
    //                     // for each character in section part
    //                     for (let character of part.characters) {
    //                         // validate character
    //                         if (typeof character !== 'object') continue;
    //                         if (!character.name || typeof character.name !== 'string') continue;
    //                         if (!character.description || typeof character.description !== 'string') continue;
    //                         // add character to characters array
    //                         characters.push({
    //                             name: character.name,
    //                             description: character.description
    //                         });
    //                     }
    //                     // if there are not any characters in this section part, section part will not be stored
    //                     if (characters.length === 0) continue;
    //                     // store characters and type of section
    //                     partData.characters = characters;
    //                     partData.type = "CHARACTERS";
    //                     // if there are 2 or more characters, material is considered testable
    //                     if (characters.length >= 2) testable = true;
    //                     break;
    //                 case "PLOT":
    //                     // validate plot array
    //                     if (!part.plot || !(part.plot instanceof Array)) continue;

    //                     // here will be stored parts of plot in section part
    //                     const plotParts = [];
    //                     // for each plot part in section part
    //                     for (let plotPart of part.plot) {
    //                         // validate plot part
    //                         if (typeof plotPart !== 'object') continue;
    //                         if (!plotPart.text || typeof plotPart.text !== 'string') continue;
    //                         // add plot part to plot parts array
    //                         plotParts.push({ text: plotPart.text });
    //                     }
    //                     // if there are not any plot parts in this section part, section part will not be stored
    //                     if (plotParts.length === 0) continue;
    //                     // store plot parts and type of section
    //                     partData.plot = plotParts;
    //                     partData.type = "PLOT";
    //                     // if there are 2 or more plot parts, material is considered testable
    //                     if (plotParts.length >= 2) testable = true;
    //                     break;
    //                 default:
    //                     continue;
    //             }
                
    //             // add section part to section
    //             sectionData.content.push(partData);
    //         }

    //         // add section to material data
    //         data.push(sectionData);
    //     }

    //     // if there are no material data, error is sent
    //     if (data.length === 0) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
    //     // check whether all sections in material data are empty or not
    //     let allSectionsEmpty = true;
    //     for (let section of data) {
    //         if (section.content.length !== 0) {
    //             allSectionsEmpty = false;
    //             break;
    //         }
    //     }
    //     // if all sections in material data are empty, error is sent
    //     if (allSectionsEmpty) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
    // } catch(err) {
    //     return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    // }
    let data;
    let testable;

    try {
        const result = processMaterialData(materialData);
        data = result.data;
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
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    }

    // material was successfully stored in database
    return res.status(201).json({});
}

// GET ALL MATERIALS
async function getMaterials(req, res) {
    const searchText = req.query.search || "";

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
        return res.status(500).json({});
    }

    const pagination = await getPagination(req.query, rowCount);

    try {
        const materials = await Material.findAll({
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
            include: [{
                model: User,
                attributes: ["username"]
            }],
            order: [
                ["title", "ASC"],
                ["id", "ASC"] // this is needed because if more rows have same title, they can appear twice in more pages
            ],
            raw: true
        });
        return res.status(200).json({
            materials: materials,
            page: pagination.page,
            pageSize: pagination.limit,
            pageCount: pagination.pageCount
        });
    } catch(err) {
        return res.status(500).json({});
    }
}

// GET MATERIAL BY ID
async function getMaterialById(req, res) {
    // get material id from params
    const materialId = +req.params.id;
    // validate material id
    if (typeof materialId !== "number") return res.status(400).json({});

    // check whether wrong answers shoud be included in response
    const includeWrongAnswers = req.query.includeWrongAnswers === "true";

    // set attributes to be retrieved from database
    const attributes = ["id", "title", "author", "materialData", "testable"];
    if (includeWrongAnswers) attributes.push("wrongAnswers");

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
        return res.status(500).json({});
    }
}

// UPDATE MATERIAL BY ID
async function patchMaterialById(req, res) {
    const materialId = +req.params.id;
    if (typeof materialId !== "number") return res.status(400).json({ error: "Nebylo předáno ID materiálu." });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
        });
    }

    const title = req.body.title;
    const author = req.body.author;
    const materialDataString = req.body.materialData;

    // parse material data to JS object
    let materialData;
    try {
        materialData = JSON.parse(materialDataString);
        // if parsed JSON is not Array, send error
        if (!(materialData instanceof Array)) return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    } catch(err) {
        return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    }

    let data;
    let testable;
    let includedSectionParts;

    try {
        const result = processMaterialData(materialData);
        data = result.data;
        testable = result.testable;
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
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    let material;
    try {
        material = await Material.findOne({
            where: {
                id: materialId
            }
        });
        if (!material) return res.status(404).json({ error: "Materiál pro aktualizaci nebyl nalezen." });
        if (material.materialAuthorId !== req.user.id) return res.status(403).json({ error: "Pro aktualizaci tohoto materiálu nemáš oprávnění." });
    } catch(err) {
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    try {
        const wrongAnswers = JSON.parse(material.wrongAnswers);
        if (wrongAnswers) {
            for (let i = 0; i < wrongAnswers.length; i++) {
                if (!includedSectionParts[wrongAnswers[i].name]) {
                    wrongAnswers.splice(i, 1);
                    i--;
                }
            }
            material.wrongAnswers = JSON.stringify(wrongAnswers);
            if (!testable && wrongAnswers.length > 0) testable = true;
        }
    } catch(err) {
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }

    try {
        // const material = await Material.findOne({
        //     where: {
        //         id: materialId
        //     }
        // });
        // if (!material) return res.status(404).json({ error: "Materiál pro aktualizaci nebyl nalezen." });
        // if (material.materialAuthorId !== req.user.id) return res.status(403).json({ error: "Pro aktualizaci tohoto materiálu nemáš oprávnění." });

        material.title = title;
        material.author = author;
        material.materialData = JSON.stringify(data);
        material.testable = testable;
        await material.save();

        return res.status(201).json({});
    } catch(err) {
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo aktualizovat." });
    }
}

async function putMaterialWrongAnswersById(req, res) {
    const materialId = +req.params.id;
    if (typeof materialId !== "number") return res.status(400).json({ error: "Nebylo předáno ID materiálu." });

    const wrongAnswersString = req.body.wrongAnswers;
    if (!wrongAnswersString) return res.status(400).json({ error: "Nebyly předány žádné špatné odpovědi k aktualizaci." });

    let wrongAnswers;
    try {
        wrongAnswers = JSON.parse(wrongAnswersString);
        if (!(wrongAnswers instanceof Array)) return res.status(400).json({ error: "Špatné odpovědi byly poslány ve špatném formátu." });
    } catch(err) {
        return res.status("400").json({ error: "Špatné odpovědi byly poslány ve špatném formátu." });
    }

    for (let i = 0; i < wrongAnswers.length; i++) {
        if (
            (typeof wrongAnswers[i] !== 'object') ||
            (typeof wrongAnswers[i].name !== 'string') ||
            (wrongAnswers[i].name === "Postavy") ||
            (wrongAnswers[i].name === "Děj") ||
            (!ValidMaterialPartNames[wrongAnswers[i].name])
        ) {
            wrongAnswers.splice(i, 1);
            i--;
            continue;
        }

        for (let j = 0; j < wrongAnswers[i].answers.length; j++) {
            let answer = wrongAnswers[i].answers[j];
            if (
                (typeof answer !== 'string') ||
                (answer === "")
            ) {
                wrongAnswers[i].answers.splice(j, 1);
                j--;
            }
        }

        if (wrongAnswers.length === 0) {
            wrongAnswers.splice(i, 1);
            i--;
        }
    }

    try {
        const material = await Material.findOne({
            where: {
                id: materialId
            }
        });
        if (!material) return res.status(404).json({ error: "Materiál pro aktualizaci špatných odpovědí nebyl nalezen." });
        if (material.materialAuthorId !== req.user.id) return res.status(403).json({ error: "Pro aktualizaci špatných opdovědí pro tento materiál nemáš oprávnění." });

        if (wrongAnswers.length === 0) {
            const materialData = JSON.parse(material.materialData);
            let testable = false;
            for (let section of materialData) {
                for (let part of section.content) {
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
            material.testable = testable;
        } else {
            material.testable = true;
        }

        material.wrongAnswers = JSON.stringify(wrongAnswers);
        await material.save();
    } catch(err) {
        return res.status(500).json({ error: "Špatné odpovědi se bohužel nepovedlo aktualizovat." });
    }

    return res.status(201).json({});
}

module.exports = {
    postMaterials,
    getMaterials,
    getMaterialById,
    patchMaterialById,
    putMaterialWrongAnswersById
}