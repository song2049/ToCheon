import express from "express";
import {
  kakaoLogin,
  refreshAccessToken,
  kakaoDebugCode,
} from "../controllers/oauth.controller.js";

const router = express.Router();
router.get("/kakao/debug", kakaoDebugCode);
router.post("/kakao", kakaoLogin);
router.post("/refresh", refreshAccessToken);

export default router;
