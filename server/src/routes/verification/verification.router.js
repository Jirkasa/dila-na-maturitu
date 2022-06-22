const express = require('express');
const controller = require('./verification.controller');

const router = express.Router();


router.get("/overeni-emailu/:token", controller.getEmailVerification);

module.exports = router;