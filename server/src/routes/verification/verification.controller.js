const User = require("../../models/user.model");
const VerificationToken = require("../../models/verificationToken.model");


async function getEmailVerification(req, res) {
    const token = req.params.token;
    if (!token) return res.sendStatus(400);

    const verificationToken = await VerificationToken.findOne({
        where: {
            token: token
        }
    });
    if (!verificationToken) return res.sendStatus(403);

    await User.update({
        verified: true
    }, {
        where: {
            id: verificationToken.userId
        }
    });
    await verificationToken.destroy();
    res.redirect("/");
}

module.exports = {
    getEmailVerification
}