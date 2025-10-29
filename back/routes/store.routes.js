import express from "express";
import {
  getStoresMap, getStores, getStoreMap, getStoreLatestPicture, getStoreReviewStats, getStoreMenu,
  getStoreDetail
} from "../controllers/store.controller.js";

const router = express.Router();

router.get("/map", getStoresMap);
router.get("/:store_id", getStoreDetail);
router.get("/:store_id/map", getStoreMap);
router.get("/:store_id/picture", getStoreLatestPicture);
router.get("/:store_id/review-stats", getStoreReviewStats);
router.get("/:store_id/menu", getStoreMenu);
router.get("/", getStores);

export default router;
