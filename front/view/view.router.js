const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

router.post("/", viewController.postSearch);
router.get("/review", viewController.getReview);

module.exports = router;