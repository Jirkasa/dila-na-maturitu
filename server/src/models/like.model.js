const Sequelize = require('sequelize');

const sequelize = require("../services/database");

// represents user likes
const Like = sequelize.define("like", {
    userId: { // user who liked
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    materialId: { // what material user liked
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    }
});

module.exports = Like;