import express from "express";
import {
  getPendingStores,
  approveStore,
  rejectStore,
  deleteStore,
  deleteReview,
} from "../controllers/admin.controller.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 승인 대기 목록
// router.get("/stores/pending", verifyToken, requireAdmin, getPendingStores);
router.get("/stores/pending", getPendingStores);

// 승인
// router.post("/stores/:id/approve", verifyToken, requireAdmin, approveStore);
router.post("/stores/:id/approve", approveStore);

// 거부
// router.post("/stores/:id/reject", verifyToken, requireAdmin, rejectStore);
router.post("/stores/:id/reject", rejectStore);

// 맛집 삭제
// router.delete("/stores/:id", verifyToken, requireAdmin, deleteStore);
router.delete("/stores/:id", deleteStore);

// 리뷰 삭제
// router.delete("/reviews/:id", verifyToken, requireAdmin, deleteReview);
router.delete("/reviews/:id", deleteReview);

export default router;
