const express = require("express");
const controller = require("./votes.controller");


// create router
const router = express.Router();

// add routes to router
// GET - VOTES (get all votes)
router.get("/", controller.getVotes);

module.exports = router;