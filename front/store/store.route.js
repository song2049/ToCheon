const express = require("express");
const router = express.Router();
const storeController = require("./store.controller.js");

// /store/[id]
router.get("/store/detail/:id", storeController.getStoreById);
router.get("/store/create", storeController.getCreate);

module.exports = router