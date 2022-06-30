const passport = require("passport");

// MIDDLEWARE TO REQUIRE VERIFIED USER AUTHENTICATION
function requireVerifiedUserAuth(req, res, next) {
    // if user is authenticated and verified, next middleware can run
    if (req.isAuthenticated() && req.user && req.user.verified) {
        return next();
    }
    // if user is not authenticated or verified, error is sent
    return res.status(403).json({});
}

module.exports = [passport.authenticate('jwt', {session: false}), requireVerifiedUserAuth];