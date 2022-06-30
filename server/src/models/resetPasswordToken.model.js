const Sequelize = require("sequelize");

const sequelize = require("../services/database");


// represents tokens that are used to reset users passwords
const ResetPasswordToken = sequelize.define("resetpasswordtoken", {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = ResetPasswordToken;