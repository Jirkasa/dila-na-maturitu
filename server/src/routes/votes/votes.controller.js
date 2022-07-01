const SurveyVote = require("../../models/surveyVote.model");
const sequelize = require("../../services/database");


// GET - VOTES
// used to get all votes of survey
async function getVotes(req, res) {
    try {
        // get how many registered users think that literature doesn't belong to maturita exam
        const agreeQuery = SurveyVote.count({
            where: {
                agree: true
            }
        });
        // get how many registered users think that literature does belong to maturita exam
        const disagreeQuery = SurveyVote.count({
            where: {
                agree: false
            }
        });

        // wait for results from database
        const [agreeCount, disagreeCount] = await Promise.all([agreeQuery, disagreeQuery]);

        // send result to client
        return res.status(200).json({
            votes: {
                agree: agreeCount,
                disagree: disagreeCount
            }
        });
    } catch(err) {
        // if something went wrong, error is sent
        return res.status(500).json({});
    }
}

module.exports = {
    getVotes
}