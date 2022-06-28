const Sequelize = require('sequelize');

const sequelize = require('../services/database');

// TODO - ještě ukládat jestli je material testovatelný
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
    materialData: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    testable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    wrongAnswers: {
        type: Sequelize.TEXT
    }
}, {
    indexes: [
        {
            fields: ["title"]
        },
        {
            fields: ["author"]
        }
    ]
});

module.exports = Material;