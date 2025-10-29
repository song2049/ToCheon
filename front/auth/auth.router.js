const express = require("express");
const router = express.Router();
const authController = require("./auth.controller.js")

router.get("/auth/login", authController.getLogin);
router.post("/auth/login", authController.postLogin);
router.delete("/auth/logout", authController.deleteLogout);


// 카카오 로그인
router.get("/oauth/login", authController.getOauthLogin);
router.get("/kakao/login", authController.getKakaoLogin);


module.exports = router;