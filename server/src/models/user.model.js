const Sequelize = require("sequelize");

const sequelize = require("../services/database");


const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(35),
        // allowNull: false
    },
    email: {
        type: Sequelize.STRING(320),
        // allowNull: false
    },
    authProvider: {
        type: Sequelize.ENUM(["password", "google"]),
        allowNull: false
    },
    authProviderProfileId: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
        // allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User;