const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { ValidMaterialPartNames, getPagination } = require("../../helpers");
const Material = require("../../models/material.model");
const User = require("../../models/user.model");

async function postMaterials(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
        });
    }

    const title = req.body.title;
    const author = req.body.author;
    const materialDataString = req.body.materialData;

    let materialData;
    try {
        materialData = JSON.parse(materialDataString);
        if (!(materialData instanceof Array)) return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    } catch(err) {
        return res.status(400).json({ error: "Data materiálu byla poslána ve špatném formátu." });
    }


    const data = [];
    try {
        for (let section of materialData) {
            if (typeof section !== 'object') continue;

            if (!section.heading || (section.heading !== "Analýza uměleckého textu" && section.heading !== "Literárněhistorický kontext")) continue;

            if (!section.content || !(section.content instanceof Array)) continue;

            const sectionData = {
                heading: section.heading,
                content: []
            }

            for (let part of section.content) {
                if (typeof part !== 'object') continue;

                if (!part.checked) continue;

                if (typeof part.name !== "string")
                if (!ValidMaterialPartNames[part.name]) continue;

                const partData = {
                    name: part.name
                }

                switch (part.type) {
                    case "TEXTAREA":
                        if (part.textAreaRows && typeof part.textAreaRows === "number") {
                            partData.textAreaRows = part.textAreaRows;
                        }
                    case "TEXT":
                        if (!part.value || typeof part.value !== "string") continue;
                        partData.value = part.value;
                        partData.type = part.type;
                        break;
                    case "CHARACTERS":
                        if (!part.characters || !(part.characters instanceof Array)) continue;

                        const characters = [];
                        for (let character of part.characters) {
                            if (typeof character !== 'object') continue;
                            if (!character.name || typeof character.name !== 'string') continue;
                            if (!character.description || typeof character.description !== 'string') continue;
                            characters.push({
                                name: character.name,
                                description: character.description
                            });
                        }
                        if (characters.length === 0) continue;
                        partData.characters = characters;
                        partData.type = "CHARACTERS";
                        break;
                    case "PLOT":
                        if (!part.plot || !(part.plot instanceof Array)) continue;

                        const plotParts = [];
                        for (let plotPart of part.plot) {
                            if (typeof plotPart !== 'object') continue;
                            if (!plotPart.text || typeof plotPart.text !== 'string') continue;
                            plotParts.push({ text: plotPart.text });
                        }
                        if (plotParts.length === 0) continue;
                        partData.plot = plotParts;
                        partData.type = "PLOT";
                        break;
                    default:
                        continue;
                }
                
                sectionData.content.push(partData);
            }

            data.push(sectionData);
        }

        if (data.length === 0) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
        let allSectionsEmpty = true;
        for (let section of data) {
            if (section.content.length !== 0) {
                allSectionsEmpty = false;
                break;
            }
        }
        if (allSectionsEmpty) return res.status(400).json({ error: "Nebyla poslána žádná validní data materiálu." });
    } catch(err) {
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    }

    try {
        await Material.create({
            title: title,
            author: author,
            materialData: JSON.stringify(data),
            materialAuthorId: req.user.id
        });
    } catch(err) {
        return res.status(500).json({ error: "Materiál se bohužel nepovedlo uložit." });
    }

    return res.status(201).json({});
}

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
            attributes: ["id", "title", "author"],
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

async function getMaterialById(req, res) {
    const materialId = +req.params.id;
    if (typeof materialId !== "number") return res.status(400).json({});

    try {
        const material = await Material.findOne({
            attributes: ["id", "title", "author", "materialData"],
            where: {
                id: materialId
            },
            include: [{
                model: User,
                attributes: ["username"]
            }],
            raw: true
        });
        if (!material) return res.status(404).json({});

        return res.status(200).json({ material: material, materialAuthor: material["user.username"] });
    } catch(err) {
        return res.status(500).json({});
    }
}

module.exports = {
    postMaterials,
    getMaterials,
    getMaterialById
}