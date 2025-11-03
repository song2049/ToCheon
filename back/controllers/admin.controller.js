import { Store, Review, User } from "../models/index.js";

// 승인 대기 목록 (TB_STORE 전체 컬럼 + 등록자 이름 포함)
export async function getPendingStores(req, res) {
  try {
    const stores = await Store.findAll({
      where: { IS_APPROVED: 0 },
      include: [
        {
          model: User,
          attributes: ["NAME"], // TB_USER에서 NAME만
        },
      ],
      order: [["CREATED_AT", "DESC"]],
    });

    res.json({ items: stores });
  } catch (error) {
    console.error("getPendingStores error:", error);
    res.status(500).json({ error: "승인 대기 목록 조회 중 오류 발생" });
  }
}

// 승인된 맛집 목록 (IS_APPROVED = 1)
export async function getApprovedStores(req, res) {
  try {
    const stores = await Store.findAll({
      where: { IS_APPROVED: 1 },
      include: [{ model: User, attributes: ["NAME"] }],
      order: [["UPDATED_AT", "DESC"]],
    });
    res.json({ items: stores });
  } catch (error) {
    console.error("getApprovedStores error:", error);
    res.status(500).json({ error: "승인된 맛집 목록 조회 중 오류 발생" });
  }
}

//맛집 상세 (관리자용)
export async function getAdminStoreDetail(req, res) {
  try {
    const { store_id } = req.params;
    const store = await Store.findByPk(store_id, {
      include: [{ model: User, attributes: ["NAME"] }],
    });

    if (!store) {
      return res.status(404).json({ message: "해당 맛집을 찾을 수 없습니다." });
    }

    res.json(store);
  } catch (error) {
    console.error("getAdminStoreDetail error:", error);
    res.status(500).json({ error: "맛집 상세 조회 중 오류 발생" });
  }
}

// 승인 처리
export async function approveStore(req, res) {
  try {
    const { id } = req.params;
    const { CATEGORY, IMAGE_URL, EATING_TIME } = req.body;

    console.log(CATEGORY, IMAGE_URL, EATING_TIME);
    

    // 유효성 검사
    if (!CATEGORY || !IMAGE_URL || !EATING_TIME) {
      return res.status(400).json({ message: "필수 값 누락: IMAGE_URL 또는 EATING_TIME" });
    }

    // 승인 및 데이터 업데이트
    await Store.update(
      { IS_APPROVED: 1, CATEGORY, IMAGE_URL, EATING_TIME },
      { where: { ID: id } }
    );

    res.json({ message: "승인 및 정보 저장 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "승인 처리 중 오류 발생" });
  }
}

// 거부 처리
export async function rejectStore(req, res) {
  const { id } = req.params;
  await Store.destroy({ where: { ID: id } });
  res.json({ message: "삭제(거부) 완료" });
}

// 맛집 삭제
export async function deleteStore(req, res) {
  const { id } = req.params;
  await Store.destroy({ where: { ID: id } });
  res.json({ message: "맛집 삭제 완료" });
}

// 리뷰 삭제
export async function deleteReview(req, res) {
  const { id } = req.params;
  await Review.destroy({ where: { ID: id } });
  res.json({ message: "리뷰 삭제 완료" });
}

// 최신 리뷰 목록
export async function getLatestReviews(req, res) {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ["NAME"] },
        { model: Store, attributes: ["NAME"] },
      ],
      order: [["CREATED_AT", "DESC"]],
      limit: 10,
    });
    res.json({ items: reviews });
  } catch (error) {
    console.error("getLatestReviews error:", error);
    res.status(500).json({ error: "최신 리뷰 조회 중 오류 발생" });
  }
}

// 회원 통계 (예시: 가입 수, 등록 수)
export async function getUserStats(req, res) {
  try {
    const totalUsers = await User.count();
    const registeredStores = await Store.count({
      where: { IS_APPROVED: 1 },
    });

    res.json({
      totalUsers,
      registeredStores,
    });
  } catch (error) {
    console.error("getUserStats error:", error);
    res.status(500).json({ error: "회원 통계 조회 중 오류 발생" });
  }
}