const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

router.post("/search", viewController.postSearch);
router.get("/review", viewController.getReview);

module.exports = router;