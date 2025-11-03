import express from "express";
import {
  getPendingStores,
  getApprovedStores,
  getAdminStoreDetail,
  getLatestReviews,
  getUserStats,
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

// 승인된 맛집 전체 조회
// router.get("/stores/approved", verifyToken, requireAdmin, getApprovedStores);
router.get("/stores/approved", getApprovedStores);

// 맛집 상세 조회 (관리자용)
router.get("/stores/:store_id", getAdminStoreDetail);

// 최근 리뷰 목록
router.get("/reviews/latest", getLatestReviews);

// 회원 통계
router.get("/users/stats", getUserStats);

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
