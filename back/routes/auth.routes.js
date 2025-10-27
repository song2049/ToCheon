import express from "express";
import { login, me, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/me", verifyToken, me);
router.post("/logout", verifyToken, logout);

export default router;
