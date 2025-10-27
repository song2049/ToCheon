const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

// router.get("/auth/login", viewController.getLogin);
router.get("/review", viewController.getReview);

module.exports = router;