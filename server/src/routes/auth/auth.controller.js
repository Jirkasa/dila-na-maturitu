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
const ResetPasswordToken = require('../../models/resetPasswordToken');


passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}, async function(jwt_payload, done) {
    try {
        const user = await User.findOne({
            where: {
                id: jwt_payload.id
            }
        });

        if (!user) return done(null, false);

        return done(null, user);
    } catch(err) {
        return done(err, false);
    }
}));

// TODO - zatím jsem do Googlu předal svůj email, ale to rozhodně změním než tu aplikaci vydám - asi si na to vytvořím nový google účet

passport.use(new GoogleStrategy({
    callbackURL: '/v1/auth/google-login/callback',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({
            where: {
                authProviderProfileId: profile.id
            }
        });
    
        // if user didn't log in before
        if (!user) {
            await User.create({
                authProvider: "google",
                authProviderProfileId: profile.id,
                verified: true
            });
    
            user = await User.findOne({
                where: {
                    authProviderProfileId: profile.id
                }
            })
        }
    
        done(null, user);
    } catch(err) {
        done(err, false);
    }
}));


async function postLogin(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }
    
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) return res.status(401).json({ error: "Špatné uživatelské jméno nebo heslo" });

        const passwordsDoMatch = await bcrypt.compare(password, user.password);
        if (!passwordsDoMatch) return res.status(401).json({ error: "Špatné uživatelské jméno nebo heslo" });

        const accessToken = helpers.generateAccessToken({ id: user.dataValues.id });
        const refreshToken = helpers.generateRefreshToken({ id: user.dataValues.id });

        await RefreshToken.create({
            token: refreshToken
        });

        res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function postLogout(req, res) {
    const refreshToken = req.headers.authorization;
    if (refreshToken && refreshToken.split(" ")[1]) {
        await RefreshToken.destroy({
            where: {
                token: refreshToken.split(" ")[1]
            }
        });
    }
    res.status(204).json({});
}

async function postRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    crypto.randomBytes(32, async (err, buffer) => {
        if (err) return res.status(500).json({ error: "Registrace se nezdařila" })
        
        let verifyToken;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.create({
                email: email,
                username: username,
                password: hashedPassword,
                authProvider: "password"
            });

            verifyToken = buffer.toString('hex');
            await VerificationToken.create({
                token: verifyToken,
                userId: user.id
            });
            res.status(201).json({});
        } catch(err) {
            return res.status(500).json({ error: "Registrace se nezdařila" });
        }

        try {
            emailer.sendVerificationEmail(email, verifyToken);
        } catch(err) {
            console.log(err);
        }
    });
}

async function postToken(req, res) {
    const refreshToken = req.headers.authorization;
    if (!refreshToken || !refreshToken.split(" ")[1]) return res.status(401).json({});
    // console.log("------");
    // console.log(refreshToken.split);

    const token = await RefreshToken.findOne({
        where: {
            token: refreshToken.split(" ")[1]
        }
    });
    if (!token) return res.status(403).json({});

    jwt.verify(refreshToken.split(" ")[1], process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({});
        const accessToken = helpers.generateAccessToken({ id: user.id});
        res.status(200).json({accessToken: accessToken});
    });
}

const getGoogleLogin = passport.authenticate("google", {
    scope: ["email"]
});

const getGoogleLoginCallback = passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
    scope: ["email"]
});

async function getGoogleLoginLoadPage(req, res) {
    const accessToken = helpers.generateAccessToken({ id: req.user.id });
    const refreshToken = helpers.generateRefreshToken({ id: req.user.id });

    try {
        await RefreshToken.create({
            token: refreshToken
        });
    
        res.render("google-authentication", {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: JSON.stringify({
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                verified: req.user.verified
            })
        });
    } catch(err) {
        res.sendStatus(500);
    }
}

async function postForgotPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    const email = req.body.email;

    const user = await User.findOne({
        where: {
            email: email
        }
    });
    if (!user) return res.status(404).json({ error: "Uživatel s tímto emailem neexistuje." });

    const token = helpers.generateResetPasswordToken({ id: user.id });
    await ResetPasswordToken.create({
        token: token,
        userId: user.id
    });
    try {
        emailer.sendResetPasswordEmail(user.email, token);
    } catch(err) {
        console.log(err);
    }
    res.status(204).json({});
}

async function getCheckResetToken(req, res) {
    const token = req.query.token;
    if (!token) return res.status(400).json({});

    const resetToken = await ResetPasswordToken.findOne({
        where: {
            token: token
        }
    });

    if (!resetToken) return res.status(404).json({});

    jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, (err, user) => {
        if (err) {
            resetToken.destroy();
            return res.status(404).json({});
        }
        return res.status(204).json({});
    });
}

async function postResetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    const password = req.body.password;
    const token = req.body.token;

    if (!token) return res.status(400).json({ error: "Nebyl předán reset token." });

    const resetToken = await ResetPasswordToken.findOne({
        where: {
            token: token
        }
    });

    if (!resetToken) return res.status(403).json({ error: "Heslo již nejde resetovat. Pošli si novou žádost o reset hesla." });

    jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, async (err, user) => {
        if (err) {
            resetToken.destroy();
            return res.status(403).json({ error: "Heslo již nejde resetovat. Pošli si novou žádost o reset hesla." });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.update({
                password: hashedPassword
            }, {
                where: {
                    id: user.id
                }
            });
            await resetToken.destroy();
            return res.status(204).json({});
        } catch(err) {
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