const express = require("express");
const router = express.Router();
const apiController = require("./api.controller.js");

// 기존에는 아래처럼 맵 마커용을 api를 따로 제작했으나 현재 검색기능과 맞추기 위해 주석처리함
// router.get("/api/stores/map", apiController.getMarker);

module.exports = router;