const Sequelize = require("sequelize");

const sequelize = require("../services/database");

const SurveyVote = sequelize.define("surveyvote", {
    agree: { // represents whether user agrees that maturita doesn't belong to maturita exam or not
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {
    indexes: [
        {
            fields: ["agree"]
        }
    ]
});
// id column is automatically added by Sequelize, but I don't need it (primary key is foreign key userId)
SurveyVote.removeAttribute("id");

module.exports = SurveyVote;