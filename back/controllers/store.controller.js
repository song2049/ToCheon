import { query } from "../db/connection.js";

/**
 * 지도용 매장 목록 (간단 정보만)
 */
export async function getStoresMap(req, res) {
  try {
    const rows = await query(`
      SELECT ID, NAME, LATITUDE, LONGITUDE
      FROM TB_STORE
      WHERE IS_APPROVED = 1
    `);
    res.json({ items: rows });
  } catch (err) {
    console.error("getStoresMap error:", err);
    res.status(500).json({ error: "DB 오류" });
  }
}

/**
 * 맛집 목록 (페이징 + 평점 집계)
 */
export async function getStores(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const offset = (page - 1) * pageSize;

  try {
    // ⚠️ LIMIT / OFFSET을 직접 문자열로 치환
    const sql = `
      SELECT
        s.ID,
        s.NAME,
        s.CATEGORY,
        s.ADDRESS,
        s.LATITUDE,
        s.LONGITUDE,
        s.IS_APPROVED,
        COALESCE(AVG((r.POINT_01 + r.POINT_02 + r.POINT_03)/3), 0) AS avgScore,
        COUNT(r.ID) AS reviewCount
      FROM TB_STORE s
      LEFT JOIN TB_REVIEW r ON s.ID = r.STORE_ID
      WHERE s.IS_APPROVED = 1
      GROUP BY s.ID
      ORDER BY avgScore DESC
      LIMIT ${offset}, ${pageSize};
    `;

    const rows = await query(sql); // ✅ LIMIT/OFFSET은 이미 문자열에 포함됨
    res.json({ items: rows, page, pageSize });
  } catch (err) {
    console.error("❌ getStores error:", err);
    res.status(500).json({ error: "DB 오류: " + err.message });
  }
}

/**
 * 매장 단건 지도 정보
 */
export async function getStoreMap(req, res) {
  const { store_id } = req.params;
  try {
    const rows = await query(
      `SELECT ID, NAME, LATITUDE, LONGITUDE
       FROM TB_STORE
       WHERE ID = ?`,
      [store_id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "존재하지 않는 매장입니다." });
    res.json(rows[0]);
  } catch (err) {
    console.error("getStoreMap error:", err);
    res.status(500).json({ error: "DB 오류" });
  }
}

/**
 * 최신 리뷰의 대표 사진
 */
export async function getStoreLatestPicture(req, res) {
  const { store_id } = req.params;
  try {
    const rows = await query(
      `
      SELECT P.URL
      FROM TB_REVIEW R
      JOIN TB_PICTURE P ON P.REVIEW_ID = R.ID
      WHERE R.STORE_ID = ?
      ORDER BY R.CREATED_AT DESC, P.ID ASC
      LIMIT 1;
      `,
      [store_id]
    );
    if (rows.length === 0) return res.json({ photoUrl: null });
    res.json({ photoUrl: rows[0].URL });
  } catch (err) {
    console.error("getStoreLatestPicture error:", err);
    res.status(500).json({ error: "DB 오류" });
  }
}

/**
 * 리뷰 통계 (평균 점수 및 리뷰 수)
 */
export async function getStoreReviewStats(req, res) {
  const { store_id } = req.params;
  try {
    const rows = await query(
      `
      SELECT
        COALESCE(AVG((POINT_01 + POINT_02 + POINT_03)/3), 0) AS avgScore,
        COUNT(*) AS reviewCount
      FROM TB_REVIEW
      WHERE STORE_ID = ?;
      `,
      [store_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("getStoreReviewStats error:", err);
    res.status(500).json({ error: "DB 오류" });
  }
}

/**
 * 매장 메뉴 목록
 */
export async function getStoreMenu(req, res) {
  const { store_id } = req.params;
  try {
    const rows = await query(
      `
      SELECT ID, NAME, PRICE, DESCRIPTION
      FROM TB_MENU
      WHERE STORE_ID = ?
      ORDER BY PRICE ASC;
      `,
      [store_id]
    );
    res.json({ items: rows });
  } catch (err) {
    console.error("getStoreMenu error:", err);
    res.status(500).json({ error: "DB 오류" });
  }
}
