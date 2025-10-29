const express = require("express");
const router = express.Router();
const storeController = require("./store.controller.js");

// /store/[id]
router.get("/store/:id", storeController.getStoreById);

module.exports = router