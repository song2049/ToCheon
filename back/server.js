import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./db/sequelize.js";

// 라우트 임포트
import authRoutes from "./routes/auth.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

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
    console.log("✅ DB Connected (Sequelize)");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

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
app.listen(PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
