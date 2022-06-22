const express = require('express');
const controller = require('./users.controller');
const requireUserAuth = require("../../middlewares/requireUserAuth");
const { query } = require('express-validator');
const User = require('../../models/user.model');

const router = express.Router();

router.get("/email", requireUserAuth, controller.getUserByEmail);
router.get("/:id", requireUserAuth, controller.getUserById);
router.patch("/username", [
    query("username")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi uživatelské jméno")
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
    })
], requireUserAuth, controller.patchUsername);
router.post("/resend-verification-token", requireUserAuth, controller.postResendVerificationToken);

module.exports = router;