const express = require("express");
const router = express.Router();
const viewController = require("./view.controller.js")

router.get("/", viewController.getMain);

router.get("/auth/login", viewController.getLogin);

module.exports = router;