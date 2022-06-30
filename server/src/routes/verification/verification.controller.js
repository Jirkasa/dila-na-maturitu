const User = require("../../models/user.model");
const VerificationToken = require("../../models/verificationToken.model");

// GET - EMAIL VERIFICATION
// this is called when user opens link from email to verify his account
async function getEmailVerification(req, res) {
    // get verification token from params
    const token = req.params.token;
    // if token wasn't passed (which is probably never true), error is sent
    if (!token) return res.sendStatus(400);

    // get verification token from database
    const verificationToken = await VerificationToken.findOne({
        where: {
            token: token
        }
    });
    // if verification token wasn't found in database, token is not valid and error is sent
    if (!verificationToken) return res.sendStatus(403);

    // update user to whom verification token belongs to be verified in database
    await User.update({
        verified: true
    }, {
        where: {
            id: verificationToken.userId
        }
    });
    // delete verification token from database
    await verificationToken.destroy();

    // redirect user to home page of frontend application
    res.redirect("/");
}

module.exports = {
    getEmailVerification
}