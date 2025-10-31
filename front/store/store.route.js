const express = require("express");
const router = express.Router();
const storeController = require("./store.controller.js");
const { verifyToken } = require("../middleware/adminMiddleware.js");

// /store/[id]
router.get("/store/detail/:id", storeController.getStoreById);
router.get("/store/create", verifyToken, storeController.getCreate);

module.exports = router