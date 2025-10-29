const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

router.post("/", viewController.postSearch);

router.get('/detail/:id', viewController.getDetail);

module.exports = router;