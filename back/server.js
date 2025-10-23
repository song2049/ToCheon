import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { pingDB } from "./db/connection.js";

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0"; // 외부 접속 허용

// CORS 설정
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON 파싱
app.use(express.json());

// DB 연결 테스트용 엔드포인트
app.get("/", async (req, res, next) => {
  try {
    const now = await pingDB();
    res.json({
      status: "OK",
      db: "connected",
      now,
      port: PORT,
    });
  } catch (err) {
    next(err);
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

// 서버 실행
app.listen(PORT, HOST, () => {
  console.log("========================================");
  console.log("✅ Server started successfully!");
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Access via your Windows IP: http://192.168.0.191:${PORT}`);
  console.log("========================================");
});
