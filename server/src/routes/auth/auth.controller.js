const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { validationResult } = require("express-validator");
const User = require('../../models/user.model');
const jwt = require("jsonwebtoken");
const helpers = require("../../helpers");
const RefreshToken = require('../../models/refreshToken.model');
const VerificationToken = require('../../models/verificationToken.model');
const emailer = require('../../services/emailer');
const ResetPasswordToken = require('../../models/resetPasswordToken.model');

// NOTE - Passport is something I will have to learn more about
//      - It's an authentication middleware for NodeJS that offers comprehensive set of authentication strategies.
//      - I kind of know what it does and managed to use it, but it's confusing for me sometimes.
//      - And Passport documentation is not very clear, so I will probably have to learn about it somewhere else.


// STRATEGY FOR AUTHENTICATION USING JSON WEB TOKENS
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}, async function(jwt_payload, done) {
    try {
        // get user using user id from decrypted JWT token
        const user = await User.findOne({
            where: {
                id: jwt_payload.id
            }
        });

        // if user wasn't found, signalize that authentication failed
        if (!user) return done(null, false);

        // signalize that authentication succeeded and provide authenticated user
        return done(null, user);
    } catch(err) {
        // something went wrong, authentication failed
        return done(err, false);
    }
}));

// STRATEGY FOR AUTHENTICATION USING GOOGLE
passport.use(new GoogleStrategy({
    callbackURL: `${process.env.SERVER_URL}/v1/auth/google-login/callback`,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // get user from database (if exists)
        let user = await User.findOne({
            where: {
                authProviderProfileId: profile.id // every google account has profile id
            }
        });
    
        // if user didn't log in before
        if (!user) {
            // store user in database
            await User.create({
                authProvider: "google",
                authProviderProfileId: profile.id,
                verified: true // users registered using google are automatically verified
            });
    
            // get stored user from database
            user = await User.findOne({
                where: {
                    authProviderProfileId: profile.id
                }
            })
        }
    
        // signalize that authentication succeeded and provide authenticated user
        done(null, user);
    } catch(err) {
        // something went wrong, authentication failed
        done(err, false);
    }
}));


// POST - LOGIN
// - used to login using password
async function postLogin(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }
    
    // get email and password
    const email = req.body.email;
    const password = req.body.password;

    try {
        // find user by email
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        // if user wasn't found, error is sent
        if (!user) return res.status(401).json({ error: "Špatné uživatelské jméno nebo heslo" });

        // compare password with hashed password stored in database
        const passwordsDoMatch = await bcrypt.compare(password, user.password);
        // if passwords do not match, error is sent
        if (!passwordsDoMatch) return res.status(401).json({ error: "Špatné uživatelské jméno nebo heslo" });

        // generate new access and refresh token
        const accessToken = helpers.generateAccessToken({ id: user.dataValues.id });
        const refreshToken = helpers.generateRefreshToken({ id: user.dataValues.id });

        // store refresh token in database
        await RefreshToken.create({
            token: refreshToken
        });

        // send access and refresh token to client
        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch {
        // if something went wrong, error is sent
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// POST - LOGOUT
// - used to logout (basically it just removes refresh token from database)
async function postLogout(req, res) {
    // get refresh token from authorization header
    const refreshToken = req.headers.authorization;

    if (refreshToken && refreshToken.split(" ")[1]) {
        // delete refresh token from database
        try {
            await RefreshToken.destroy({
                where: {
                    token: refreshToken.split(" ")[1]
                }
            });
        } catch(err) {
            console.log(err);
        }
    }
    // inform client that logout was successfull (even when it might not be, because we are just deleting refresh token from database)
    res.status(204).json({});
}

// POST - REGISTER
// - used to register using password
async function postRegister(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    // get email, username and password from body
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // generate verification token using crypto.randomBytes function
    crypto.randomBytes(32, async (err, buffer) => {
        // if error occured, send error to client
        if (err) return res.status(500).json({ error: "Registrace se nezdařila" })
        
        let verifyToken;
        try {
            // hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            // store user in database
            const user = await User.create({
                email: email,
                username: username,
                password: hashedPassword,
                authProvider: "password"
            });

            // create verification token
            verifyToken = buffer.toString('hex');
            // store verification token in database
            await VerificationToken.create({
                token: verifyToken,
                userId: user.id
            });
            // inform user that he was successfully registered
            res.status(201).json({});
        } catch(err) {
            // if something went wrong, error is sent
            return res.status(500).json({ error: "Registrace se nezdařila" });
        }

        // send verification email
        try {
            emailer.sendVerificationEmail(email, verifyToken);
        } catch(err) {
            console.log(err);
        }
    });
}

// POST - TOKEN
// used to generate new access tokens using refresh token
async function postToken(req, res) {
    // get refresh token from authorization header
    const refreshToken = req.headers.authorization;
    // if refresh token wasn't sent by client, error is sent
    if (!refreshToken || !refreshToken.split(" ")[1]) return res.status(401).json({});

    // get refresh token from database
    const token = await RefreshToken.findOne({
        where: {
            token: refreshToken.split(" ")[1]
        }
    });
    // if token wasn't found in database, error is sent
    if (!token) return res.status(403).json({});

    // verify refresh token
    jwt.verify(refreshToken.split(" ")[1], process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        // if verification failed, error is sent
        if (err) return res.status(403).json({});
        // generate new access token
        const accessToken = helpers.generateAccessToken({ id: user.id});
        // send access token to client
        res.status(200).json({accessToken: accessToken});
    });
}

// GET - GOOGLE LOGIN
// - handled by passport (user is redirected to sign in using google)
const getGoogleLogin = passport.authenticate("google", {
    scope: ["email"]
});

// GET - GOOGLE LOING CALLBACK
// - handled by passport (user is authenticated after he signs in)
const getGoogleLoginCallback = passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
    scope: ["email"]
});

// GET - GOOGLE LOGIN LOAD PAGE
// - page, that is rendered after the user is signed in to store access and refresh token to local storage (so frontend can use it)
async function getGoogleLoginLoadPage(req, res) {
    // generate access and refresh token
    const accessToken = helpers.generateAccessToken({ id: req.user.id });
    const refreshToken = helpers.generateRefreshToken({ id: req.user.id });

    try {
        // store refresh token in database
        await RefreshToken.create({
            token: refreshToken
        });
    
        // render page that will save access and refresh token to local storage
        res.render("google-authentication", {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: JSON.stringify({ // user is saved in local storage too
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                verified: req.user.verified
            })
        });
    } catch(err) {
        // if something went wrong, error is sent
        res.sendStatus(500);
    }
}

// POST - FORGOT PASSWORD
// used to send reset password token to email
async function postForgotPassword(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    // get email from body
    const email = req.body.email;

    // find user by email in database
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    // if user with this email doesn't exist, error is sent
    if (!user) return res.status(404).json({ error: "Uživatel s tímto emailem neexistuje." });

    // generate reset password token
    const token = helpers.generateResetPasswordToken({ id: user.id });
    // hash reset password token
    const hashedToken = await bcrypt.hash(token, 12);
    // store reset password token in database
    await ResetPasswordToken.create({
        token: hashedToken,
        userId: user.id
    });
    // send reset password token email
    try {
        emailer.sendResetPasswordEmail(user.email, token);
    } catch(err) {
        console.log(err);
    }
    res.status(204).json({});
}

// GET - CHECK RESET TOKEN
// used to check wheter password reset token is valid or not
async function getCheckResetToken(req, res) {
    // get reset token from query object
    const token = req.query.token;
    // if token wasn't passed, error is sent
    if (!token) return res.status(400).json({});

    // verify reset token
    jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, async (err, user) => {
        // if verification failed, reset token is not valid
        if (err) {
            return res.status(404).json({});
        }

        try {
            // get reset token from database
            const resetToken = await ResetPasswordToken.findOne({
                where: {
                    userId: user.id
                }
            });
            // if reset token wasn't found in database, reset token is not valid
            if (!resetToken) return res.status(404).json({});
    
            // reset token was succesfully verified
            return res.status(204).json({});
        } catch(err) {
            // if something went wrong, error is sent
            return res.status(500).json({});
        }
    });
}

// POST - RESET PASSWORD
// used to reset password (set new password) using reset password token
async function postResetPassword(req, res) {
    // get validation result from express validator
    const errors = validationResult(req);
    // if there are any errors, send them to client
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    // get password and reset token from body
    const password = req.body.password;
    const token = req.body.token;

    // if token wasn't passed, error is sent
    if (!token) return res.status(400).json({ error: "Nebyl předán reset token." });

    // verify reset token
    jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, async (err, user) => {
        // if verification failed, reset token is not valid and password can't be reset
        if (err) {
            return res.status(403).json({ error: "Heslo již nejde resetovat. Pošli si novou žádost o reset hesla." });
        }

        try {
            // get reset token from database
            const resetToken = await ResetPasswordToken.findOne({
                where: {
                    userId: user.id
                }
            });
            // if reset token wasn't found in database, error is sent
            if (!resetToken) return res.status(403).json({ error: "Heslo již nejde resetovat. Pošli si novou žádost o reset hesla." });

            // check whether token do match hashed token in database
            const tokenDoMatch = await bcrypt.compare(token, resetToken.token);
            // if token doesn't match hashed token in database, reset token is not valid
            if (!tokenDoMatch) return res.status(403).json({ error: "Heslo již nejde resetovat. Pošli si novou žádost o reset hesla." });

            // hash password
            const hashedPassword = await bcrypt.hash(password, 12);
            // change user password
            await User.update({
                password: hashedPassword
            }, {
                where: {
                    id: user.id
                }
            });
            // delete reset token in database
            await resetToken.destroy();
            // inform user that his password was succesfully change
            return res.status(204).json({});
        } catch(err) {
            // if something went wrong, error is sent
            return res.status(500).json({ error: "Při vytváření nového hesla došlo k chybě." });
        }
    });
}

module.exports = {
    postLogin,
    postLogout,
    postRegister,
    postToken,
    getGoogleLogin,
    getGoogleLoginCallback,
    getGoogleLoginLoadPage,
    postForgotPassword,
    getCheckResetToken,
    postResetPassword
}