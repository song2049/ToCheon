// /back/controllers/store.controller.js
import { Store } from "../models/store.js";
import { Review } from "../models/review.js";
import { Picture } from "../models/picture.js";
import { Menu } from "../models/menu.js";

// 1. 전체 맛집 목록 조회
export async function getStores(req, res) {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error("getStores error:", error);
    res.status(500).json({ error: "맛집 목록 조회 중 오류 발생" });
  }
}

// 2. 지도 표시용 좌표 목록
export async function getStoresMap(req, res) {
  try {
    const stores = await Store.findAll({
      attributes: ["ID", "NAME", "LAT", "LNG"],
    });
    res.json(stores);
  } catch (error) {
    console.error("getStoresMap error:", error);
    res.status(500).json({ error: "지도용 매장 데이터 조회 실패" });
  }
}

// 3. 단일 매장 위치 정보
export async function getStoreMap(req, res) {
  try {
    const { store_id } = req.params;
    const store = await Store.findByPk(store_id, {
      attributes: ["ID", "NAME", "LAT", "LNG", "ADDRESS"],
    });
    if (!store) return res.status(404).json({ error: "매장을 찾을 수 없습니다." });
    res.json(store);
  } catch (error) {
    console.error("getStoreMap error:", error);
    res.status(500).json({ error: "매장 위치 조회 실패" });
  }
}

// 4. 최신 리뷰 사진
export async function getStoreLatestPicture(req, res) {
  try {
    const { store_id } = req.params;
    const picture = await Picture.findOne({
      where: { STORE_ID: store_id },
      order: [["CREATED_AT", "DESC"]],
    });
    if (!picture) return res.status(404).json({ error: "등록된 사진이 없습니다." });
    res.json(picture);
  } catch (error) {
    console.error("getStoreLatestPicture error:", error);
    res.status(500).json({ error: "리뷰 사진 조회 실패" });
  }
}

// 5. 리뷰 통계
export async function getStoreReviewStats(req, res) {
  try {
    const { store_id } = req.params;
    const stats = await Review.findAll({
      where: { STORE_ID: store_id },
      attributes: [
        "RATING",
        [Review.sequelize.fn("COUNT", Review.sequelize.col("RATING")), "count"],
      ],
      group: ["RATING"],
    });
    res.json(stats);
  } catch (error) {
    console.error("getStoreReviewStats error:", error);
    res.status(500).json({ error: "리뷰 통계 조회 실패" });
  }
}

// 6. 메뉴 정보
export async function getStoreMenu(req, res) {
  try {
    const { store_id } = req.params;
    const menus = await Menu.findAll({ where: { STORE_ID: store_id } });
    res.json(menus);
  } catch (error) {
    console.error("getStoreMenu error:", error);
    res.status(500).json({ error: "메뉴 조회 실패" });
  }
}
