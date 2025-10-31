// utils/seedDummyData.js
import { User, Store, Menu, Review, Picture } from "../models/index.js";

export async function seedDummyData() {
  const userCount = await User.count();
  if (userCount > 0) {
    console.log("더미데이터가 이미 존재합니다. skip...");
    return;
  }

  console.log("더미데이터를 초기화합니다...");

  const ADMIN_HASH =
    "$2b$10$aQ1en58ZONvZ4VDgqpGFqOz.loCq9xKhiX1bzKWweQTytlfjsgq1a"; // "admin"

  /* -------------------------------
   * 1. 사용자 생성 (TB_USER)
   * ------------------------------- */
  const users = [
    { EMAIL: "admin@test.com", PASSWORD: ADMIN_HASH, NAME: "관리자", ROLE: "ADMIN" },
    { EMAIL: "user1@test.com", PASSWORD: ADMIN_HASH, NAME: "사용자1", ROLE: "USER" },
    { EMAIL: "user2@test.com", PASSWORD: ADMIN_HASH, NAME: "사용자2", ROLE: "USER" },
    { EMAIL: "user3@test.com", PASSWORD: ADMIN_HASH, NAME: "사용자3", ROLE: "USER" },
  ];
  const createdUsers = await User.bulkCreate(users);
  console.log(`사용자 ${createdUsers.length}명 생성 완료`);

  /* -------------------------------
   * 2. 매장 생성 (TB_STORE)
   * ------------------------------- */
  const stores = [];
  const categories = ["한식", "중식", "양식", "일식", "카페", "디저트"];
  const descs = ["국밥 맛집", "짜장면 명가", "파스타 레스토랑", "초밥 전문점", "분위기 좋은 카페", "달콤한 디저트"];
  const tags = ["#맛집", "#가성비", "#데이트코스", "#직장인점심", "#청결한", "#분위기좋은"];

  for (let i = 1; i <= 10; i++) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    stores.push({
      USER_ID: user.ID,
      CATEGORY: categories[i % categories.length],
      NAME: `천호맛집_${i}`,
      ADDRESS: `서울특별시 강동구 천호동 ${100 + i}번지`,
      LATITUDE: 37.5386 + (Math.random() - 0.5) * 0.005,
      LONGITUDE: 127.1245 + (Math.random() - 0.5) * 0.005,
      TEL_NUMBER: `02-${4000 + i}-${1000 + i}`,
      DESCRIPTION: descs[i % descs.length],
      HASH_TAG: tags[i % tags.length],
      EATING_TIME: "09:00~20:00",
      IS_APPROVED: 1,
      CREATED_AT: new Date(),
    });
  }
  const createdStores = await Store.bulkCreate(stores);
  console.log(`매장 ${createdStores.length}개 생성 완료`);

  /* -------------------------------
   * 3. 메뉴 생성 (TB_MENU)
   * ------------------------------- */
  const menus = [];
  createdStores.forEach(store => {
    for (let j = 1; j <= 3; j++) {
      menus.push({
        STORE_ID: store.ID,
        NAME: `대표메뉴_${store.ID}_${j}`,
        PRICE: 6000 + j * 500,
        DESCRIPTION: `매장 ${store.NAME}의 ${j}번째 메뉴`,
        IS_RECOMMANDED: j === 1 ? 1 : 0,
        CREATED_AT: new Date(),
      });
    }
  });
  await Menu.bulkCreate(menus);
  console.log(`메뉴 ${menus.length}개 생성 완료`);

  /* -------------------------------
   * 4. 리뷰 생성 (TB_REVIEW)
   * ------------------------------- */
  const reviews = [];
  for (const store of createdStores) {
    const writer = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    for (let r = 1; r <= 2; r++) {
      reviews.push({
        STORE_ID: store.ID,
        USER_ID: writer.ID,
        POINT_01: Math.ceil(Math.random() * 5),
        POINT_02: Math.ceil(Math.random() * 5),
        POINT_03: Math.ceil(Math.random() * 5),
        CONTENT: `${store.NAME} 방문 후기 ${r}`,
        ORDERED_ITEM: `대표메뉴_${store.ID}_${r}`,
        CREATED_AT: new Date(),
      });
    }
  }
  const createdReviews = await Review.bulkCreate(reviews);
  console.log(`리뷰 ${createdReviews.length}개 생성 완료`);

  /* -------------------------------
   * 5. 리뷰 사진 생성 (TB_PICTURE)
   * ------------------------------- */
  const FIXED_IMAGE_URL =
    "https://pup-review-phinf.pstatic.net/MjAyNTA5MzBfMjM2/MDAxNzU5MjA3MjIxOTYy.dYxmTuOtnRQLmQRAbnpPqfnLwFnKWGUO_q9XK5sUOhEg.Yf7BQppFlDQtBOVHT9WrGsn1zI_QtQ2LgAmlHBkHw-Eg.JPEG/17592072022671894938368576511893.jpg?type=w560_sharpen";

  const pictures = createdReviews.map((review, idx) => ({
    REVIEW_ID: review.ID,
    URL: FIXED_IMAGE_URL,
    IS_MAIN: idx % 3 === 0 ? 1 : 0,
    CREATED_AT: new Date(),
  }));
  await Picture.bulkCreate(pictures);
  console.log(`사진 ${pictures.length}개 생성 완료`);

  console.log("모든 더미데이터 생성 완료");
}
