import express from "express";
import { kakaoLogin, kakaoLogout } from "../controllers/oauth.controller.js";

const router = express.Router();

router.post("/login", kakaoLogin);
router.post("/logout", kakaoLogout);

export default router;
