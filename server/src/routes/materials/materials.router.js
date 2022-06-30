const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const requireVerifiedUserAuth = require('../../middlewares/requireVerifiedUserAuth');
const controller = require('./materials.controller');


// create router
const router = express.Router();

// add routes to router
// POST - MATERIALS (create new material)
router.post("/", requireVerifiedUserAuth, [
    body("title")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi název díla.")
    .isLength({max: 255}).withMessage("Maximální délka názvu díla je 255 znaků."),
    body("author")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi autora.")
    .isLength({max: 255}).withMessage("Maximální délka autora je 255 znaků."),
    body("materialData")
    .isLength({min: 1}).withMessage("Nebyla předána data materiálu")
], controller.postMaterials);
// GET - MATERIALS (get materials - pagination is used)
router.get("/", controller.getMaterials);
// GET - MATERIAL BY ID (get material by ID)
router.get("/:id", controller.getMaterialById);
// PATCH - MATERIAL BY ID (update material by ID)
router.patch("/:id", requireVerifiedUserAuth, [
    body("title")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi název díla.")
    .isLength({max: 255}).withMessage("Maximální délka názvu díla je 255 znaků."),
    body("author")
    .trim()
    .isLength({min: 1}).withMessage("Nezadal jsi autora.")
    .isLength({max: 255}).withMessage("Maximální délka autora je 255 znaků."),
    body("materialData")
    .isLength({min: 1}).withMessage("Nebyla předána data materiálu")
], controller.patchMaterialById);
// PUT - MATERIAL WRONG ANSWERS BY ID (update material wrong answers by material ID)
router.put("/:id/wrong-answers", requireVerifiedUserAuth, controller.putMaterialWrongAnswersById);
// DELETE - MATERIAL BY ID (delete material by ID)
router.delete("/:id", requireVerifiedUserAuth, controller.deleteMaterialById);
// POST - LIKE MATERIAL BY ID
router.post("/:id/like", requireVerifiedUserAuth, controller.postLikeMaterialById);
// DELETE - UNLIKE MATERIAL BY ID
router.delete("/:id/like", requireVerifiedUserAuth, controller.deleteLikeMaterialById);

module.exports = router;