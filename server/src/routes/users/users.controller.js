const crypto = require('crypto');
const { validationResult } = require("express-validator");
const Material = require('../../models/material.model');
const User = require("../../models/user.model");
const VerificationToken = require("../../models/verificationToken.model");
const emailer = require("../../services/emailer");
const { Op, QueryTypes } = require("sequelize");
const { getPagination } = require('../../helpers');
const sequelize = require('../../services/database');
const SurveyVote = require('../../models/surveyVote.model');


// GET - USER BY ID
// used to get user by ID
async function getUserById(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to get this user, error is sent (users can only get themselves)
    if (id !== req.user.id) return res.status(403).json({});

    try {
        // fetch user from database
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        // if user wasn't found, error is sent
        if (!user) return res.status(404).json({});

        // send user to client
        res.status(200).json({ user: {
            id: user.id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }});
    } catch(err) {
        // if something went wrong, error is sent
        res.status(500).json({});
    }
}

// GET - USER BY EMAIL
// used to get user by email
async function getUserByEmail(req, res) {
    // get email from query object
    const email = req.query.email;
    // if email wasn't passed, error is sent
    if (!email) return res.status(400).json({ error: "No email was passed" });

    try {
        // fetch user from database
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        // if user wasn't found, error is sent
        if (!user) return res.status(404).json({});
        // if user doesn't have right to get this user, error is sent (users can only get themselves)
        if (user.id !== req.user.id) return res.status(403).json({});

        // send user to client
        res.status(200).json({ user: {
            id: user.id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }});
    } catch(err) {
        // if something went wrong, error is sent
        res.status(500).json({});
    }
}

// GET - MATERIALS
// used to get materials of user (pagination is used)
async function getMaterials(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to get materials of this user, error is sent (users can only get their own materials)
    if (id !== req.user.id) return res.status(403).json({});

    // get search text from query object (if user want's to search material)
    const searchText = req.query.search || "";

    // count number of items in materials table
    let rowCount;
    try {
        rowCount = await Material.count({
            where: {
                materialAuthorId: req.user.id,
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
        // fetch materials from database with info whether user likes material or not
        let materials;
        if (process.env.USE_POSTGRESS === "true") {
            materials = await sequelize.query(`
            SELECT
                \`material\`.\`id\`, \`material\`.\`title\`, \`material\`.\`author\`, \`material\`.\`testable\`, \`likes\`.\`userId\` IS NOT NULL AS "liked"
            FROM \`materials\` AS \`material\`
            LEFT OUTER JOIN
                \`likes\` ON \`likes\`.\`userId\` = :userId AND \`material\`.\`id\` = \`likes\`.\`materialId\`
            WHERE \`material\`.\`materialAuthorId\` = :userId AND (\`material\`.\`title\` LIKE :search OR \`material\`.\`author\` LIKE :search)
            ORDER BY \`material\`.\`title\` ASC, \`material\`.\`id\` ASC LIMIT :skip, :limit;
            `, {
                replacements: {
                    search: searchText+"%",
                    skip: pagination.skip,
                    limit: pagination.limit,
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        } else {
            // - previously, Postgress was used on Heroku, but it is no longer free
            materials = await sequelize.query(`
            SELECT
                "material"."id", "material"."title", "material"."author", "material"."testable", "likes"."userId" IS NOT NULL AS "liked"
            FROM "materials" AS "material"
            LEFT OUTER JOIN
                "likes" ON "likes"."userId" = :userId AND "material"."id" = "likes"."materialId"
            WHERE "material"."materialAuthorId" = :userId AND ("material"."title" LIKE :search OR "material"."author" LIKE :search)
            ORDER BY "material"."title" ASC, "material"."id" ASC LIMIT :limit OFFSET :skip;
            `, {
                replacements: {
                    search: searchText+"%",
                    skip: pagination.skip,
                    limit: pagination.limit,
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        }

        // send materials to client
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

// GET - LIKED MATERIALS
// used to get materials, that user liked (pagination is used)
async function getLikedMaterials(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to get liked materials of this user, error is sent (users can only get their own materials)
    if (id !== req.user.id) return res.status(403).json({});

    // get search text from query object (if user want's to search material)
    const searchText = req.query.search || "";

    // count number of user liked material
    let rowCount;
    try {
        if (process.env.USE_POSTGRESS === "true") {
            rowCount = await sequelize.query(`
            SELECT
                COUNT(*) AS count
            FROM \`materials\` AS \`material\`
            INNER JOIN
                \`likes\` ON \`likes\`.\`userId\` = :userId AND \`material\`.\`id\` = \`likes\`.\`materialId\`
            WHERE (\`material\`.\`title\` LIKE :search OR \`material\`.\`author\` LIKE :search);
            `, {
                replacements: {
                    search: searchText+"%",
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        } else {
            // - previously, Postgress was used on Heroku, but it is no longer free
            rowCount = await sequelize.query(`
            SELECT
                COUNT(*) AS count
            FROM "materials" AS "material"
            INNER JOIN
                "likes" ON "likes"."userId" = :userId AND "material"."id" = "likes"."materialId"
            WHERE ("material"."title" LIKE :search OR "material"."author" LIKE :search);
            `, {
                replacements: {
                    search: searchText+"%",
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        }
    } catch(err) {
        console.log(err);
        // if something went wrong, error is sent
        return res.status(500).json({});
    }

    // get pagination result
    const pagination = await getPagination(req.query, rowCount[0].count);

    try {
        // fetch liked materials from database
        let materials;
        if (process.env.USE_POSTGRESS === "true") {
            materials = await sequelize.query(`
            SELECT
                \`material\`.\`id\`, \`material\`.\`title\`, \`material\`.\`author\`, \`user\`.\`username\` AS \`user.username\`, \`material\`.\`testable\`, true AS "liked"
            FROM \`materials\` AS \`material\`
            LEFT OUTER JOIN
                    \`users\` AS \`user\` ON \`material\`.\`materialAuthorId\` = \`user\`.\`id\`
            INNER JOIN
                \`likes\` ON \`likes\`.\`userId\` = :userId AND \`material\`.\`id\` = \`likes\`.\`materialId\`
            WHERE (\`material\`.\`title\` LIKE :search OR \`material\`.\`author\` LIKE :search)
                ORDER BY \`material\`.\`title\` ASC, \`material\`.\`id\` ASC LIMIT :skip, :limit;
            `, {
                replacements: {
                    search: searchText+"%",
                    skip: pagination.skip,
                    limit: pagination.limit,
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        } else {
            // - previously, Postgress was used on Heroku, but it is no longer free
            materials = await sequelize.query(`
            SELECT
                "material"."id", "material"."title", "material"."author", "user"."username" AS "user.username", "material"."testable", true AS "liked"
            FROM "materials" AS "material"
            LEFT OUTER JOIN
                    "users" AS "user" ON "material"."materialAuthorId" = "user"."id"
            INNER JOIN
                "likes" ON "likes"."userId" = :userId AND "material"."id" = "likes"."materialId"
            WHERE ("material"."title" LIKE :search OR "material"."author" LIKE :search)
                ORDER BY "material"."title" ASC, "material"."id" ASC LIMIT :limit OFFSET :skip;
            `, {
                replacements: {
                    search: searchText+"%",
                    skip: pagination.skip,
                    limit: pagination.limit,
                    userId: req.user.id
                },
                type: QueryTypes.SELECT
            });
        }

        // send materials to client
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

// PATCH - USERNAME
// used to change (set) user username
// - only users with no username can set their name
async function patchUsername(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    // if user already has username, error is sent (only users with no username can set their username)
    if (req.user.username) return res.status(403).json({});

    // get username from query object
    const username = req.query.username;

    // set new username to user
    req.user.username = username;
    // save user to database
    await req.user.save();

    // send updated user back to client
    res.status(200).json({ user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        verified: req.user.verified
    }})
}

// POST - RESEND VERIFICATION TOKEN
// used to send new email for account verification
async function postResendVerificationToken(req, res) {
    // if user is already verified, error is sent
    if (req.user.verified) return res.status(409).json({});

    // try to find verification token in database
    let verificationToken;
    try {
        verificationToken = await VerificationToken.findOne({
            where: {
                userId: req.user.id
            }
        });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }

    if (!verificationToken) {
        // if verification token wasn't found in database, new one is created use crypto.randomBytes function
        crypto.randomBytes(32, async (err, buffer) => {
            // if something went wrong, error is sent
            if (err) return res.status(500).json({})
            
            let verifyToken;
            try {
                // get verify token
                verifyToken = buffer.toString('hex');
                // save verify token in database
                await VerificationToken.create({
                    token: verifyToken,
                    userId: req.user.id
                });
                // inform user that verification token was sent (not yet, but it will)
                res.status(204).json({});
            } catch(err) {
                // if something went wrong, error is sent
                return res.status(500).json({});
            }
    
            // send verification email with generated verify token
            try {
                emailer.sendVerificationEmail(req.user.email, verifyToken);
            } catch(err) {
                console.log(err);
            }
        });
    } else {
        // if verification token was found in database, token is sent to email without generating new one
        try {
            emailer.sendVerificationEmail(req.user.email, verificationToken.token);
        } catch(err) {
            console.log(err);
        }
        // inform user that new verirification email was sent
        res.status(204).json({});
    }
}

// POST - VOTE
// used to vote in survey
async function postVote(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to change vote of this user, error is sent
    if (id !== req.user.id) return res.status(403).json({});

    // get vote from query object
    let agree = req.query.agree;

    // validate and get result from agree query parameter
    if (agree === "true") agree = true;
    else if (agree === "false") agree = false;
    else return res.status(400).json({ error: "Query attribute agree must be set to true or false." });

    try {
        // add/update vote in database
        await SurveyVote.upsert({
            agree: agree,
            userId: id
        });
        // inform user that his vote has been accepted
        return res.status(200).json({ agree: agree});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// DELETE - VOTE
// used to delete vote in survey for user
async function deleteVote(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to delete vote of this user, error is sent
    if (id !== req.user.id) return res.status(403).json({});

    try {
        // delete vote from database
        await SurveyVote.destroy({
            where: {
                userId: id
            }
        });

        // inform user that his vote has been deleted
        return res.status(200).json({});
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

// GET - VOTE
// used to get vote of user
async function getVote(req, res) {
    // get user id from params
    const id = +req.params.id;
    // if user doesn't have right to get vote of this user, error is sent
    if (id !== req.user.id) return res.status(403).json({});

    try {
        // get user vote from database
        const vote = await SurveyVote.findOne({
            attributes: ["agree"],
            where: {
                userId: id
            },
            raw: true
        });
        // send user vote to client
        return res.status(200).json({ vote: vote });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    getMaterials,
    getLikedMaterials,
    patchUsername,
    postResendVerificationToken,
    postVote,
    deleteVote,
    getVote
}