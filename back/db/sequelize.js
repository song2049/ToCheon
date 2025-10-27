// /back/db/sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// 환경변수 불러오기
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || "3306";
const DB_USER = process.env.DB_USER || "tocheon";
const DB_PASS = process.env.DB_PASS || "block13";
const DB_NAME = process.env.DB_NAME || "tocheon_db";

// Sequelize 인스턴스 생성
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

// DB 연결 확인 함수
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB Connected (Sequelize)");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
}

export default sequelize;
