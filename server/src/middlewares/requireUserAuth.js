const passport = require("passport");

// MIDDLEWARE TO REQUIRE USER AUTHENTICATION
function requireUserAuth(req, res, next) {
    // if user is authenticated, next middleware can run
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    // if user is not authenticated, error is sent
    return res.status(403).json({});
}

module.exports = [passport.authenticate('jwt', {session: false}), requireUserAuth];