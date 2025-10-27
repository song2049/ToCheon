import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./db/sequelize.js";
import axios from "axios"; //kakao Oauth2.0 사용위해 import 
import jwt from "jsonwebtoken"; // JWT 발급을 위해 추가

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

// DB 연결 확인 (Sequelize)
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB Connected (Sequelize)");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
}

// --------------------- Kakao OAuth ---------------------
app.get("/oauth/kakao", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Authorization code not provided.");

  try {
    // 1) 카카오 토큰 요청
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.REDIRECT_URI,
        code,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token: kakao_token } = tokenResponse.data;
    if (!kakao_token)
      return res.status(401).json({ message: "token is not defined!" });

    // 2) 카카오 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakao_token}` },
    });

    const kakaoData = userResponse.data;
    const userInfo = {
      id: kakaoData.id,
      nickname: kakaoData.properties?.nickname || "unknown",
      thumbnail: kakaoData.properties?.thumbnail_image || null,
      email: kakaoData.kakao_account?.email || null,
    };

    // 3) JWT 발급
    const jwt_token = jwt.sign(userInfo, process.env.JWT_SECRET || "wnqudgus1234", {
      expiresIn: "1h", // 토큰 유효기간 1시간
    });

    // 쿠키 대신 JSON으로 응답
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

// 라우트 연결
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// 헬스 체크용 기본 라우트
app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

// 서버 시작
app.listen(SERVER_PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${SERVER_PORT}`);
});
