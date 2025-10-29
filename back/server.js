import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./db/sequelize.js";
import axios from "axios";
import jwt from "jsonwebtoken";

// 모델 임포트
import { User, Store, Menu, Review, Picture } from "./models/index.js";

// 라우트 임포트
import authRoutes from "./routes/auth.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 4000;

// 미들웨어 설정
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* -------------------------------------------------------
 *  더미데이터 자동 생성 함수
 * ------------------------------------------------------- */
async function seedDummyData() {
  const userCount = await User.count();
  if (userCount > 0) {
    console.log("더미데이터가 이미 존재합니다. skip...");
    return;
  }

  console.log("더미데이터를 초기화합니다...");

  const ADMIN_HASH = "$2b$10$aQ1en58ZONvZ4VDgqpGFqOz.loCq9xKhiX1bzKWweQTytlfjsgq1a"; // "admin" 비밀번호 해시

  // 사용자 5명
  const users = [];
  users.push({
    EMAIL: `email@email.com`,
    PASSWORD: ADMIN_HASH, // admin 해시로 통일
    NAME: `관리자`,
    ROLE: "ADMIN",
  });
  for (let i = 1; i <= 5; i++) {
    users.push({
      EMAIL: `user${i}@test.com`,
      PASSWORD: ADMIN_HASH, // admin 해시로 통일
      NAME: `사용자${i}`,
      ROLE: i === 1 ? "ADMIN" : "USER",
    });
  }
  const createdUsers = await User.bulkCreate(users);

  // 맛집 10개 (서울 강동구 천호동 기준)
  const stores = [];
  const categories = ["디저트", "국밥", "카페", "중식", "한식", "양식"];
  
  const descriptions = [
    "국밥이 맛있는 한식당",
    "짜장면이 인기있는 중식당",
    "파스타가 맛있는 양식 레스토랑",
    "초밥이 신선한 일식집",
    "떡볶이가 매운 분식집",
    "커피 향이 좋은 카페",
  ];
  const hashtags = [
    "#맛집 #천호동맛집 #인기있는",
    "#데이트코스 #강동구맛집",
    "#가성비좋은 #가족식사",
    "#직장인점심 #분위기좋은",
    "#혼밥맛집 #청결한가게",
    "#리뷰많은 #강동핫플",
  ];
  
  for (let i = 1; i <= 20; i++) {
    const baseLat = 37.5386; // 천호동 중심 위도
    const baseLng = 127.1245; // 천호동 중심 경도
  
    const category = categories[Math.floor(Math.random() * categories.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const tag = hashtags[Math.floor(Math.random() * hashtags.length)];
    const phone = `02-${4000 + Math.floor(Math.random() * 1000)}-${1000 + i}`;
  
    stores.push({
      USER_ID: createdUsers[Math.floor(Math.random() * createdUsers.length)].ID,
      NAME: `천호맛집_${i}`,
      CATEGORY: category,
      ADDRESS: `서울특별시 강동구 천호동 ${100 + i}번지`,
      EATING_TIME: `09:00~20:00`,
      PHONE: phone,
      DESCRIPTION: desc,
      HASH_TAG: tag,
      LATITUDE: baseLat + (Math.random() - 0.5) * 0.005,   // 천호동 근처
      LONGITUDE: baseLng + (Math.random() - 0.5) * 0.005, // 천호동 근처
      IS_APPROVED: 0,
    });
  }
  const createdStores = await Store.bulkCreate(stores);
  

  // 메뉴 30개
  const menus = [];
  for (let i = 1; i <= 30; i++) {
    menus.push({
      STORE_ID: createdStores[Math.floor(Math.random() * createdStores.length)].ID,
      NAME: `대표메뉴_${i}`,
      PRICE: 5000 + i * 100,
      DESCRIPTION: `${i}번째 맛있는 메뉴입니다.`,
      IS_RECOMMANDED: i % 2,
    });
  }
  await Menu.bulkCreate(menus);

  // 리뷰 30개
  const reviews = [];
  for (let i = 1; i <= 30; i++) {
    reviews.push({
      STORE_ID: createdStores[Math.floor(Math.random() * createdStores.length)].ID,
      USER_ID: createdUsers[Math.floor(Math.random() * createdUsers.length)].ID,
      POINT_01: Math.ceil(Math.random() * 5),
      POINT_02: Math.ceil(Math.random() * 5),
      POINT_03: Math.ceil(Math.random() * 5),
      CONTENT: `이곳은 정말 맛있어요! (${i})`,
      ORDERED_ITEM: `대표메뉴_${i}`,
      CREATED_AT: new Date(),
    });
  }
  const createdReviews = await Review.bulkCreate(reviews);

  // 사진 40개
  const pictures = [];
  for (let i = 1; i <= 40; i++) {
    pictures.push({
      REVIEW_ID: createdReviews[Math.floor(Math.random() * createdReviews.length)].ID,
      URL: `https://placehold.co/400x300?text=Picture_${i}`,
      IS_MAIN: i % 5 === 0,
      CREATED_AT: new Date(),
    });
  }
  await Picture.bulkCreate(pictures);

  console.log("더미데이터 생성 완료!");
}

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB Connected (Sequelize)");

    // ORM 테이블 자동 생성 (force: true = 항상 새로)
    await sequelize.sync({ force: true });
    console.log("모든 테이블 동기화 완료 (Sequelize)");

    // 더미데이터 자동 삽입
    await seedDummyData();
  } catch (err) {
    console.error("DB 초기화 중 오류:", err);
    process.exit(1);
  }
}

// --------------------- Kakao OAuth ---------------------
app.post("/oauth/kakao", async (req, res) => {
  const { client_id, redirect_uri, code } = req.body;
  if (!code) return res.status(400).send("Authorization code not provided.");

  try {
    // 1. 카카오 토큰 요청
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id,
        redirect_uri,
        code,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token: kakao_token } = tokenResponse.data;
    if (!kakao_token) return res.status(401).json({ message: "token is not defined!" });

    // 2. 카카오 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakao_token}` },
    });

    const kakaoData = userResponse.data;
    const userInfo = {
      id: kakaoData.id,
      nickname: kakaoData.properties?.nickname || "unknown",
      thumbnail: kakaoData.properties?.thumbnail_image || null,
      email: kakaoData.kakao_account?.email || null,
      provider: "kakao",
    };

    // 3. JWT 발급
    const jwt_token = jwt.sign(userInfo, process.env.JWT_SECRET || "wnqudgus1234", {
      expiresIn: "1h",
    });

    // 쿠키 대신 JSON 응답
    return res.json({
      message: "Kakao login success",
      token: jwt_token,
      user: userInfo,
    });
  } catch (error) {
    console.error("Kakao login failed:", error.message);
    res.status(500).send({
      error: "Kakao login Failed",
      message: error.response?.data || error.message,
    });
  }
});
// -----------------------------------------------------------

app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

app.listen(SERVER_PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${SERVER_PORT}`);
});
