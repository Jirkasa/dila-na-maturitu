const express = require('express');
const { body } = require("express-validator");
const controller = require('./auth.controller');
const User = require('../../models/user.model');
// const passport = require('passport');

const router = express.Router();

// TODO - toto použít na endpointy, kde je potřeba authentikace
// router.use(passport.authenticate('jwt', {session: false}));

router.post("/login", [
    body("email")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi email"),
    body("password")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi heslo")
], controller.postLogin);
router.post("/logout", controller.postLogout);
router.post("/register", [
    body("username")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi uživatelské jméno")
    .isLength({min: 3, max: 35}).withMessage("Uživatelské jméno musí být v rozsahu 3-35 znaků")
    .custom(async username => {
        try {
            const user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (user) return Promise.reject("Účet s tímto uživatelským jménem je již vytvořený");
        } catch(e) {
            throw new Error("Došlo k chybě při validaci jména");
        }
    }),
    body("email")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi email")
    .isLength({max: 320}).withMessage("Maximální počet znaků emailu je 320")
    .custom(async email => {
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (user) return Promise.reject("Účet s tímto emailem je již vytvořený");
        } catch(e) {
            throw new Error("Došlo k chybě při validaci emailu");
        }
    }),
    body("password")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi heslo")
    .isLength({min: 6}).withMessage("Heslo musí být dlouhé alespoň 6 znaků")
    .isLength({max: 255}).withMessage("Heslo může být dlouhé maximálně 255 znaků")
], controller.postRegister);
router.post("/token", controller.postToken);
router.get("/google-login", controller.getGoogleLogin);
router.get("/google-login/callback", controller.getGoogleLoginCallback, controller.getGoogleLoginLoadPage);
router.post("/forgot-password", [
    body("email")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi email")
    .isLength({max: 320}).withMessage("Maximální počet znaků emailu je 320")
], controller.postForgotPassword);
router.get("/check-reset-token", controller.getCheckResetToken);
router.post("/reset-password", [
    body("password")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi heslo")
    .isLength({min: 6}).withMessage("Heslo musí být dlouhé alespoň 6 znaků")
    .isLength({max: 255}).withMessage("Heslo může být dlouhé maximálně 255 znaků")
], controller.postResetPassword);
// router.get("/test", (req, res) => {
//     console.log(req.user);
//     res.status(200).json(req.user);
// });

module.exports = router;