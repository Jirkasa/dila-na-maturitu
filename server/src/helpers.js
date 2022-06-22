const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' });
}

function generateResetPasswordToken(user) {
    return jwt.sign(user, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: '15m'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken
}