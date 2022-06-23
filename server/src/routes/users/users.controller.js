const crypto = require('crypto');
const { validationResult } = require("express-validator");
const User = require("../../models/user.model");
const VerificationToken = require("../../models/verificationToken.model");
const emailer = require("../../services/emailer");


async function getUserById(req, res) {
    const id = +req.params.id;
    if (id !== req.user.id) return res.status(403).json({});

    try {
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (!user) return res.status(404).json({});

        res.status(200).json({ user: {
            id: user.id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }});
    } catch(err) {
        res.status(500).json({});
    }
}

async function getUserByEmail(req, res) {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "No email was passed" });

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) return res.status(404).json({});
        if (user.id !== req.user.id) return res.status(403).json({});

        res.status(200).json({ user: {
            id: user.id,
            username: user.username,
            email: user.email,
            verified: user.verified
        }});
    } catch(err) {
        res.status(500).json({});
    }
}

async function patchUsername(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: "Validation failed",
            errors: errors.mapped()
        });
    }

    if (req.user.username) return res.status(403).json({});

    const username = req.query.username;

    req.user.username = username;
    await req.user.save();

    res.status(200).json({ user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        verified: req.user.verified
    }})
}

async function postResendVerificationToken(req, res) {
    if (req.user.verified) return res.status(409).json({});

    const verificationToken = await VerificationToken.findOne({
        where: {
            userId: req.user.id
        }
    });

    if (!verificationToken) {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) return res.status(500).json({})
            
            let verifyToken;
            try {
                verifyToken = buffer.toString('hex');
                await VerificationToken.create({
                    token: verifyToken,
                    userId: req.user.id
                });
                res.status(204).json({});
            } catch(err) {
                return res.status(500).json({});
            }
    
            try {
                emailer.sendVerificationEmail(req.user.email, verifyToken);
            } catch(err) {
                console.log(err);
            }
        });
    } else {
        try {
            emailer.sendVerificationEmail(req.user.email, verificationToken.token);
        } catch(err) {
            console.log(err);
        }
        res.status(204).json({});
    }
}

module.exports = {
    getUserById,
    getUserByEmail,
    patchUsername,
    postResendVerificationToken
}