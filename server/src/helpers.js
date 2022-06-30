const jwt = require("jsonwebtoken");

// GENERATES ACCESS TOKEN
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// GENERATES REFRESH TOKEN
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' });
}

// GENERATES RESET PASSWORD TOKEN
function generateResetPasswordToken(user) {
    return jwt.sign(user, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: '15m'});
}

// LIST OF VALID MATERIAL PART NAMES
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

// FUNCTION TO PROCESS MATERIAL DATA
// - processes material data and does at least some checks to validate material data
// - and it also determines whether the material is testable or not
// returns:
// - data - processed material data
// - testable - determines whether the material is testable or not
// - includedSectionParts - section parts that the material contains
function processMaterialData(materialData) {
    // here will be stored processed material data
    const data = [];
    // here will be stored whether material is testable or not
    let testable = false;
    // here will be stored section parts that the material contains
    // - it can be used to determine whether the material is testable or not after it is returned from this function
    const includedSectionParts = {};

    // for each section of material data
    for (let section of materialData) {
        // validate section
        if (typeof section !== 'object') continue;
        if (!section.heading || (section.heading !== "Analýza uměleckého textu" && section.heading !== "Literárněhistorický kontext")) continue;
        if (!section.content || !(section.content instanceof Array)) continue;

        // here will be stored section data
        const sectionData = {
            heading: section.heading,
            content: []
        }

        // for each part of section
        for (let part of section.content) {
            // validate part of section
            if (typeof part !== 'object') continue;
            if (!part.checked) continue;
            if (typeof part.name !== "string") continue;
            if (!ValidMaterialPartNames[part.name]) continue;

            // here will be stored section part data
            const partData = {
                name: part.name
            }

            // do appropriate action based on type of section part
            switch (part.type) {
                case "TEXTAREA":
                    // if section part contains information about text area rows, it will be stored
                    if (part.textAreaRows && typeof part.textAreaRows === "number") {
                        partData.textAreaRows = part.textAreaRows;
                    }
                case "TEXT":
                    // validate value of section part
                    if (!part.value || typeof part.value !== "string") continue;
                    // store value and type of section part
                    partData.value = part.value;
                    partData.type = part.type;
                    break;
                case "CHARACTERS":
                    // validate characters array
                    if (!part.characters || !(part.characters instanceof Array)) continue;

                    // here will be stored characters of section part
                    const characters = [];
                    // for each character in section part
                    for (let character of part.characters) {
                        // validate character
                        if (typeof character !== 'object') continue;
                        if (!character.name || typeof character.name !== 'string') continue;
                        if (!character.description || typeof character.description !== 'string') continue;
                        // add character to characters array
                        characters.push({
                            name: character.name,
                            description: character.description
                        });
                    }
                    // if there are not any characters in this section part, section part will not be stored
                    if (characters.length === 0) continue;
                    // store characters and type of section
                    partData.characters = characters;
                    partData.type = "CHARACTERS";
                    // if there are 2 or more characters, material is considered testable
                    if (characters.length >= 2) testable = true;
                    break;
                case "PLOT":
                    // validate plot array
                    if (!part.plot || !(part.plot instanceof Array)) continue;

                    // here will be stored parts of plot in section part
                    const plotParts = [];
                    // for each plot part in section part
                    for (let plotPart of part.plot) {
                        // validate plot part
                        if (typeof plotPart !== 'object') continue;
                        if (!plotPart.text || typeof plotPart.text !== 'string') continue;
                        // add plot part to plot parts array
                        plotParts.push({ text: plotPart.text });
                    }
                    // if there are not any plot parts in this section part, section part will not be stored
                    if (plotParts.length === 0) continue;
                    // store plot parts and type of section
                    partData.plot = plotParts;
                    partData.type = "PLOT";
                    // if there are 2 or more plot parts, material is considered testable
                    if (plotParts.length >= 2) testable = true;
                    break;
                default:
                    continue;
            }
            
            // add section part to section
            sectionData.content.push(partData);
            // set that this section part is included in material
            includedSectionParts[partData.name] = true;
        }

        // add section to material data
        data.push(sectionData);
    }

    // return processed material data, whether the material is testable and parts that are included in this material
    return {data, testable, includedSectionParts};
}

// constants for pagination
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;
const MAX_PAGE_LIMIT = 20;
// FUNCTION FOR PAGINATION CALCULATIONS
// returns:
// - page - current page
// - skip - how many items should be skipped
// - limit - how many items are per page
// - pageCount - how many pages are available
async function getPagination(query, rowCount) {
    // get page and limit from query object
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    let limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    // check whether limit is smaller or equal to MAX_PAGE_LIMIT
    if (limit > MAX_PAGE_LIMIT) limit = MAX_PAGE_LIMIT;

    // calculate skip value
    const skip = (page - 1) * limit;

    // calculate page count
    const pageCount = Math.ceil(rowCount/limit);

    // return results of pagination calculations
    return {
        page,
        skip,
        limit,
        pageCount
    };
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    ValidMaterialPartNames,
    getPagination,
    processMaterialData
}