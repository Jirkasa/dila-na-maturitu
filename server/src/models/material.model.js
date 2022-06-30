const Sequelize = require('sequelize');

const sequelize = require('../services/database');

const Material = sequelize.define("material", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    materialData: { // strigified JSON object containing material data
        type: Sequelize.TEXT,
        allowNull: false
    },
    testable: { // represent whether material can be used for testing
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    wrongAnswers: { // stringified JSON object containing wrong answers for material data
        type: Sequelize.TEXT
    }
}, {
    indexes: [ // indexes are used to speed up searching of materials
        {
            fields: ["title"]
        },
        {
            fields: ["author"]
        }
    ]
});

module.exports = Material;