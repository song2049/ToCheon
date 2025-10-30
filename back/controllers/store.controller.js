// /back/controllers/store.controller.js
import { Store } from "../models/store.js";
import { Review } from "../models/review.js";
import { Picture } from "../models/picture.js";
import { Menu } from "../models/menu.js";

// 1. 전체 맛집 목록 조회 (승인된 데이터만)
export async function getStores(req, res) {
  try {
    // IS_APPROVED = '1' 인 데이터만 조회
    const stores = await Store.findAll({
      where: { IS_APPROVED: "1" },
      order: [["ID", "DESC"]], // 선택: 최신순 정렬
    });

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
      attributes: ["ID", "NAME", "LATITUDE", "LONGITUDE"],
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
      attributes: ["ID", "NAME", "LATITUDE", "LONGITUDE", "ADDRESS"],
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

    // TB_PICTURE는 REVIEW_ID 기준으로 연결되므로, 리뷰에서 최신 ID 가져와야 함
    const latestReview = await Review.findOne({
      where: { STORE_ID: store_id },
      order: [["CREATED_AT", "DESC"]],
    });

    if (!latestReview) {
      return res.status(404).json({ error: "리뷰가 없습니다." });
    }

    const picture = await Picture.findOne({
      where: { REVIEW_ID: latestReview.ID },
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

    // TB_REVIEW는 RATING 대신 POINT_01~03 사용
    const stats = await Review.findAll({
      where: { STORE_ID: store_id },
      attributes: [
        [Review.sequelize.fn("AVG", Review.sequelize.col("POINT_01")), "avg_taste"],
        [Review.sequelize.fn("AVG", Review.sequelize.col("POINT_02")), "avg_price"],
        [Review.sequelize.fn("AVG", Review.sequelize.col("POINT_03")), "avg_service"],
        [Review.sequelize.fn("COUNT", Review.sequelize.col("ID")), "review_count"],
      ],
    });

    res.json(stats[0]);
  } catch (error) {
    console.error("getStoreReviewStats error:", error);
    res.status(500).json({ error: "리뷰 통계 조회 실패" });
  }
}

// 6. 메뉴 정보
export async function getStoreMenu(req, res) {
  try {
    const { store_id } = req.params;
    const menus = await Menu.findAll({
      where: { STORE_ID: store_id },
      attributes: ["ID", "NAME", "PRICE", "DESCRIPTION", "IS_RECOMMANDED"],
    });
    res.json(menus);
  } catch (error) {
    console.error("getStoreMenu error:", error);
    res.status(500).json({ error: "메뉴 조회 실패" });
  }
}

// 7. 단일 매장 기본 정보 (상세페이지용)
export async function getStoreDetail(req, res) {
  try {
    const { store_id } = req.params;

    const store = await Store.findByPk(store_id, {
      attributes: ["TEL_NUMBER", "HASH_TAG", "ADDRESS", "EATING_TIME"],
    });

    if (!store) {
      return res.status(404).json({ error: "해당 매장을 찾을 수 없습니다." });
    }

    res.json(store);
  } catch (error) {
    console.error("getStoreDetail error:", error);
    res.status(500).json({ error: "매장 상세 정보 조회 실패" });
  }
}

// 8. 맛집 등록 요청 처리 (관리자 승인 전)
export async function postStore(req, res) {
  try {
    const {
      name,        // 가게 이름
      address,     // 주소
      tel_number,  // 전화번호
      latitude,    // 위도
      longitude,   // 경도
      description, // 맛집 설명
      hash_tag,    // 해시태그 (선택)
      eating_time,  // 영업시간 (선택)
      map_address //지도주소(MAP_URL)
    } = req.body;

    // 필수값 확인
    if (!name || !address || !latitude || !longitude || !map_address) {
      return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }
         
    // DB에 등록 (승인 전 상태)
    const userId = req.user?.id || 1;
    const newStore = await Store.create({
      USER_ID: userId,
      NAME: name,
      ADDRESS: address,
      TEL_NUMBER: tel_number,
      LATITUDE: latitude,
      LONGITUDE: longitude,
      DESCRIPTION: description || "",
      HASH_TAG: hash_tag || "",
      EATING_TIME: eating_time || "",
      IS_APPROVED: "0",  // 승인 대기 상태
      MAP_URL: map_address
    });

    res.status(201).json({
      message: "등록 요청이 완료되었습니다. 관리자의 승인을 기다려주세요.",
      store: newStore
    });
  } catch (error) {
    console.error("postStore error:", error);
    res.status(500).json({ error: "맛집 등록 요청 처리 실패" });
  }
}