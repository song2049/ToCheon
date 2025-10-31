const express = require("express");
const router = express.Router();
const authController = require("./auth.controller.js");
const { loginVerifyToken } = require("../middleware/adminMiddleware.js");


router.get("/auth/login", loginVerifyToken, authController.getLogin);
router.post("/auth/login", authController.postLogin);
router.delete("/auth/logout", authController.deleteLogout);


// 카카오 로그인
router.get("/oauth/login", authController.getOauthLogin);
router.get("/kakao/login", authController.getKakaoLogin);
// 카카오 디버깅 코드
router.get("/kakao/debug", authController.kakaoDebugCode);

module.exports = router;