import { query } from "../db/connection.js";

export async function createReview(req, res) {
  const { store_id } = req.params;
  const { point1, point2, point3, content, orderedItem, photos = [] } = req.body;
  const userId = req.user.userId;

  if (!point1 || !point2 || !point3)
    return res.status(400).json({ error: "평점(POINT_01~03)은 모두 필수입니다." });

  const pool = (await import("../db/connection.js")).default;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO TB_REVIEW
       (USER_ID, STORE_ID, POINT_01, POINT_02, POINT_03, CONTENT, ORDERED_ITEM, CREATED_AT)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, store_id, point1, point2, point3, content, orderedItem]
    );
    const reviewId = result.insertId;

    if (Array.isArray(photos) && photos.length) {
      const photoValues = photos.map((url, idx) => [reviewId, url, idx === 0 ? 1 : 0]);
      await conn.query(
        `INSERT INTO TB_PICTURE (REVIEW_ID, URL, IS_MAIN, CREATED_AT)
         VALUES ?`,
        [photoValues.map((v) => [...v, new Date()])]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "리뷰가 등록되었습니다.", reviewId });
  } catch (e) {
    await conn.rollback();
    console.error("리뷰 등록 오류:", e);
    res.status(500).json({ error: "리뷰 등록 실패" });
  } finally {
    conn.release();
  }
}

export async function listReviews(req, res) {
  const { store_id } = req.params;
  const { page = 1, pageSize = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);

  const rows = await query(
    `SELECT R.ID,
            R.USER_ID,
            U.NAME AS userName,
            R.POINT_01, R.POINT_02, R.POINT_03,
            R.CONTENT,
            R.ORDERED_ITEM,
            R.CREATED_AT,
            (
              SELECT JSON_ARRAYAGG(P.URL)
              FROM TB_PICTURE P
              WHERE P.REVIEW_ID = R.ID
            ) AS PHOTOS
     FROM TB_REVIEW R
     JOIN TB_USER U ON R.USER_ID = U.ID
     WHERE R.STORE_ID = ?
     ORDER BY R.CREATED_AT DESC
     LIMIT ? OFFSET ?`,
    [store_id, Number(pageSize), offset]
  );

  res.json({ items: rows, page: Number(page), pageSize: Number(pageSize) });
}
