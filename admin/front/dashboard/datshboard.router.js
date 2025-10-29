const express = require("express");
const router = express.Router();
const dashboardController = require("./dashboard.controller.js");

router.post("/admin/approve", dashboardController.postApprove);


module.exports = router;