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

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;
const MAX_PAGE_LIMIT = 20;
async function getPagination(query, rowCount) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    let limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    if (limit > MAX_PAGE_LIMIT) limit = MAX_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    // const rowCount = await model.count();
    const pageCount = Math.ceil(rowCount/limit);

    return {
        page,
        skip,
        limit,
        pageCount
    };
  }
  
  module.exports = {
    getPagination,
  };

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    ValidMaterialPartNames,
    getPagination
}