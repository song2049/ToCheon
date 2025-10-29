const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

router.post("/", viewController.postSearch);

router.get('/detail', viewController.getDetail);
router.post('/detail', viewController.postDetail);

module.exports = router;