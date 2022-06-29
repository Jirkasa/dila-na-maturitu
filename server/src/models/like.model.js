const Sequelize = require('sequelize');

const sequelize = require("../services/database");

const Like = sequelize.define("like", {
    userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    materialId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
});

module.exports = Like;