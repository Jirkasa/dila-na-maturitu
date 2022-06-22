const passport = require("passport");

function requireVerifiedUserAuth(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.verified) {
        return next();
    }
    return res.status(403).json({});
}

module.exports = [passport.authenticate('jwt', {session: false}), requireVerifiedUserAuth];