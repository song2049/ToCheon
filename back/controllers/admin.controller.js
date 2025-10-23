import { query } from "../db/connection.js";
import pool from "../db/connection.js";

export async function listPendingRestaurants(req, res) {
  const rows = await query("SELECT id, restaurantName, latitude, longitude FROM restaurants WHERE isVerified = 0");
  res.json({ items: rows });
}

export async function approveRestaurant(req, res) {
  const { id } = req.params;
  await query("UPDATE TB_STORE SET IS_APPROVED = 1 WHERE ID = ?", [id]);
  res.json({ message: "승인되었습니다." });
}

export async function rejectRestaurant(req, res) {
  const { id } = req.params;
  await query("UPDATE TB_STORE SET IS_APPROVED = 0 WHERE ID = ?", [id]);
  res.json({ message: "거부 처리되었습니다." });
}

export async function deleteRestaurant(req, res) {
  const conn = await pool.getConnection();
  const { id } = req.params;
  try {
    await conn.beginTransaction();
    await conn.query(
      "DELETE p FROM review_photos p JOIN reviews v ON p.reviewId = v.id WHERE v.restaurantId = ?",
      [id]
    );
    await conn.query("DELETE FROM reviews WHERE restaurantId = ?", [id]);
    await conn.query("DELETE FROM menus WHERE restaurantId = ?", [id]);
    await conn.query("DELETE FROM restaurants WHERE id = ?", [id]);
    await conn.commit();
    res.json({ message: "음식점이 삭제되었습니다." });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM review_photos WHERE reviewId = ?", [id]);
    await conn.query("DELETE FROM reviews WHERE id = ?", [id]);
    await conn.commit();
    res.json({ message: "리뷰가 삭제되었습니다." });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
