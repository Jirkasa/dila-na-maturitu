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

const ValidMaterialPartNames = {
    "Téma a motiv": true,
    "Časoprostor": true,
    "Kompozice": true,
    "Literární druh": true,
    "Literární žánr": true,
    "Vypravěč": true,
    "Lyrický subjekt": true,
    "Vyprávěcí způsob": true,
    "Postavy": true,
    "Typy promluv": true,
    "Veršovaná výstavba": true,
    "Jazykové prostředky": true,
    "Děj": true,
    "Umělecký směr": true,
    "Období": true,
    "Další autoři ze stejného období": true
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    ValidMaterialPartNames
}