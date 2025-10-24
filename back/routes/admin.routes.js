import express from "express";
import {
  listPendingRestaurants, approveRestaurant, rejectRestaurant, deleteRestaurant, deleteReview
} from "../controllers/admin.controller.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get("/restaurants/pending", listPendingRestaurants);
router.post("/restaurants/:id/approve", approveRestaurant);
router.post("/restaurants/:id/reject", rejectRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.delete("/reviews/:id", deleteReview);

export default router;
