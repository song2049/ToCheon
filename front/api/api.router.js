const express = require("express");
const router = express.Router();
const apiController = require("./api.controller.js");

router.get("/api/stores/map", apiController.getMarker);

module.exports = router;