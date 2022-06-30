const Sequelize = require('sequelize');

const sequelize = require('../services/database');


// represents tokens for account verification
const VerificationToken = sequelize.define("verificationtoken", {
    token: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = VerificationToken;