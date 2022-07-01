const express = require('express');
const controller = require('./users.controller');
const requireUserAuth = require("../../middlewares/requireUserAuth");
const { query } = require('express-validator');
const User = require('../../models/user.model');
const requireVerifiedUserAuth = require('../../middlewares/requireVerifiedUserAuth');


// create router
const router = express.Router();

// add routes to router
// GET - EMAIL (get user by email)
router.get("/email", requireUserAuth, controller.getUserByEmail);
// GET - USER MATERIALS
router.get("/:id/materials", requireUserAuth, controller.getMaterials);
// GET - LIKED MATERIALS
router.get("/:id/liked-materials", requireUserAuth, controller.getLikedMaterials);
// GET - ID (get user by ID)
router.get("/:id", requireUserAuth, controller.getUserById);
// PATCH - USERNAME (change username of user)
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
// POST - RESEND VERIFICATION TOKEN (send new email to verify account)
router.post("/resend-verification-token", requireUserAuth, controller.postResendVerificationToken);
// POST - VOTE
router.post("/:id/vote", requireVerifiedUserAuth, controller.postVote);
// POST - DELETE VOTE
router.delete("/:id/vote", requireVerifiedUserAuth, controller.deleteVote);
// GET - VOTE
router.get("/:id/vote", requireVerifiedUserAuth, controller.getVote);

module.exports = router;