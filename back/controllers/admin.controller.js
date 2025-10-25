import { Store, Review } from "../models/index.js";

// 승인 대기 목록
export async function getPendingStores(req, res) {
  const stores = await Store.findAll({ where: { IS_APPROVED: 0 } });
  res.json({ items: stores });
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
