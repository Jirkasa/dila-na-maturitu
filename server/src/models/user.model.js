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
    },
    email: {
        type: Sequelize.STRING(320),
    },
    authProvider: { // determines whether user is registered using google or password
        type: Sequelize.ENUM(["password", "google"]),
        allowNull: false
    },
    authProviderProfileId: { // stores google profile id when user is registered using google
        type: Sequelize.STRING,
    },
    password: { // users that are not registered using google have password
        type: Sequelize.STRING,
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User;