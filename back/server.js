import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { sequelize } from "./db/sequelize.js";
import { seedDummyData } from "./utils/seedDummyData.js";

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
 * DB 연결 및 더미데이터 초기화
 * ------------------------------------------------------- */
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB Connected (Sequelize)");
    await sequelize.sync({ force: true });
    console.log("모든 테이블 동기화 완료 (Sequelize)");
    await seedDummyData(); 
  } catch (err) {
    console.error("DB 초기화 중 오류:", err);
    process.exit(1);
  }
}

// 라우트 등록
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

// 서버 실행
app.listen(SERVER_PORT, "0.0.0.0", async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${SERVER_PORT}`);
});
