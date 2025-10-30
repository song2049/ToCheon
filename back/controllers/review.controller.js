import { Review, Picture } from "../models/index.js";

/**
 * 리뷰 작성
 */
export async function createReview(req, res) {
  const { store_id } = req.params;
  const { point1, point2, point3, content, orderedItem, photos = [] } = req.body;
  const userId = req.user?.userId || req.nickname; //카카오 로긴의 경우 req.user가 없음 - nickname 사용으로 대체

  if (!userId) return res.status(401).json({ error: "인증이 필요합니다." });

  try {
    // 1. 리뷰 생성
    const review = await Review.create({
      USER_ID: userId,
      STORE_ID: store_id,
      POINT_01: point1,
      POINT_02: point2,
      POINT_03: point3,
      CONTENT: content,
      ORDERED_ITEM: orderedItem,
      CREATED_AT: new Date(),
    });

    // 2. 사진 등록 (선택사항)
    if (Array.isArray(photos) && photos.length > 0) {
      const pictureData = photos.map((url) => ({
        REVIEW_ID: review.ID,
        URL: url,
        IS_MAIN: false,
        CREATED_AT: new Date(),
      }));
      await Picture.bulkCreate(pictureData);
    }

    res.status(201).json({
      message: "리뷰가 등록되었습니다.",
      reviewId: review.ID,
    });
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ error: "리뷰 등록 중 오류 발생" });
  }
}

/**
 * 리뷰 목록 조회
 */
export async function listReviews(req, res) {
  const { store_id } = req.params;
  const { page = 1, pageSize = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);

  try {
    const reviews = await Review.findAll({
      where: { STORE_ID: store_id },
      include: [
        {
          model: Picture,
          as: "Pictures", //  alias 대소문자 일치 (models/index.js와 동일해야 함)
          attributes: ["URL", "IS_MAIN"],
          required: false, // 사진이 없어도 리뷰 조회 가능 (LEFT JOIN)
        },
      ],
      limit: Number(pageSize),
      offset,
      order: [["CREATED_AT", "DESC"]],
    });

    res.json({
      items: reviews,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (err) {
    console.error("listReviews error:", err);
    res.status(500).json({ error: "리뷰 목록 조회 중 오류 발생" });
  }
}
