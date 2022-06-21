const passport = require("passport");

function requireUserAuth(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    return res.status(403).json({});
}

module.exports = [passport.authenticate('jwt', {session: false}), requireUserAuth];