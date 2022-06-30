const express = require('express');
const { body } = require("express-validator");
const controller = require('./auth.controller');
const User = require('../../models/user.model');

// create router
const router = express.Router();

// add routes to router
// POST - LOGIN (using password)
router.post("/login", [
    body("email")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi email"),
    body("password")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi heslo")
], controller.postLogin);
// POST - LOGOUT
router.post("/logout", controller.postLogout);
// POST - REGISTER (using password)
router.post("/register", [
    body("username")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi uživatelské jméno")
    .isLength({min: 3, max: 35}).withMessage("Uživatelské jméno musí být v rozsahu 3-35 znaků")
    .custom(async username => { // checks whether user with this username exists or not
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
    .custom(async email => { // checks whether user with this email exists or not
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
// POST - TOKEN (used to generate new access tokens using refresh token)
router.post("/token", controller.postToken);
// GET - GOOGLE LOGIN (called by frontend - user is redirected to sign in using google)
router.get("/google-login", controller.getGoogleLogin);
// GET - GOOGLE LOGIN CALLBACK (called after user signs in)
router.get("/google-login/callback", controller.getGoogleLoginCallback, controller.getGoogleLoginLoadPage);
// POST - FORGOT PASSWORD (used to send email with password reset token)
router.post("/forgot-password", [
    body("email")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi email")
    .isLength({max: 320}).withMessage("Maximální počet znaků emailu je 320")
], controller.postForgotPassword);
// GET - CHECK RESET TOKEN (checks whether password reset token is valid)
router.get("/check-reset-token", controller.getCheckResetToken);
// POST - RESET PASSWORD (used to reset password)
router.post("/reset-password", [
    body("password")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi heslo")
    .isLength({min: 6}).withMessage("Heslo musí být dlouhé alespoň 6 znaků")
    .isLength({max: 255}).withMessage("Heslo může být dlouhé maximálně 255 znaků")
], controller.postResetPassword);

module.exports = router;