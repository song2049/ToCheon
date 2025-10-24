import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { pingDB } from "./db/connection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0"; // 외부 접근 허용

// 프론트엔드 IP 지정 (CORS)
const FRONTEND_URL = "http://192.168.0.187:3000";

// CORS 설정 (쿠키 포함)
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());

// 헬스체크
app.get("/", async (req, res, next) => {
  try {
    const now = await pingDB();
    res.json({ status: "OK", db: "connected", now, port: PORT });
  } catch (e) {
    next(e);
  }
});

// REST API 라우트 등록
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// 에러 핸들링
app.use(notFound);
app.use(errorHandler);

// 서버 시작
app.listen(PORT, HOST, () => {
  console.log("========================================");
  console.log(`Server started successfully!`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://192.168.0.191:${PORT}`);
  console.log("========================================");
});
