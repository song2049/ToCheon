// routes/auth.routes.js
import express from "express";
import { login, me, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// 로그인
router.post("/login", login);

// 로그인 사용자 정보 확인
router.get("/me", me);

// 로그아웃
router.post("/logout", logout);

export default router;
