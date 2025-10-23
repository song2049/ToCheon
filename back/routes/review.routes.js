import express from "express";
import { createReview, listReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:store_id", verifyToken, createReview);
router.get("/:store_id", listReviews);

export default router;
