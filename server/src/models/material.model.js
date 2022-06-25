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
    materialData: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Material;