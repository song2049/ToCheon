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

// 승인 처리
export async function approveStore(req, res) {
  const { id } = req.params;
  await Store.update({ IS_APPROVED: 1 }, { where: { ID: id } });
  res.json({ message: "승인 완료" });
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
