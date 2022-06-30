const express = require('express');
const controller = require('./verification.controller');


// create router
const router = express.Router();

// add route for account verification (this is called when user opens link from email to verify his account)
router.get("/overeni-emailu/:token", controller.getEmailVerification);

module.exports = router;