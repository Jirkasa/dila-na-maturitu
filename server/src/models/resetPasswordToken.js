const Sequelize = require("sequelize");

const sequelize = require("../services/database");


const ResetPasswordToken = sequelize.define("resetpasswordtoken", {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = ResetPasswordToken;