import express from "express";
import { login, me, logout, refresh} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/me", verifyToken, me);
router.post("/logout", verifyToken, logout);
router.post("/refresh", refresh);

export default router;
