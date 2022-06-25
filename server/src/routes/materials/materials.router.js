const express = require('express');
const { body } = require('express-validator');
const requireVerifiedUserAuth = require('../../middlewares/requireVerifiedUserAuth');

const controller = require('./materials.controller');


const router = express.Router();

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

module.exports = router;