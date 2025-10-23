// routes/auth.routes.js
import express from "express";
import { login, me, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", me);        // 읽기용으로 GET 사용 (원하면 POST로 변경 가능)
router.post("/logout", logout);

export default router;
