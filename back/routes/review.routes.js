// routes/review.routes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createReview,
  listReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

// 리뷰 작성 (로그인 사용자만 가능)
router.post("/:store_id", verifyToken, createReview);

// 리뷰 목록 조회 (공개)
router.get("/:store_id", listReviews);

export default router;
