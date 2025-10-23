// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { pingDB } from "./db/connection.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"; // 프론트 주소

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // 쿠키 허용
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// 헬스체크
app.get("/", async (req, res, next) => {
  try {
    const now = await pingDB();
    res.json({ status: "OK", db: "connected", now, port: PORT });
  } catch (e) {
    next(e);
  }
});

// 라우트
app.use("/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log("========================================");
  console.log("✅ Server started successfully!");
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Frontend origin allowed: ${FRONTEND_ORIGIN}`);
  console.log("========================================");
});
