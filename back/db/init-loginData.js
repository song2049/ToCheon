import bcrypt from "bcrypt";
import { sequelize } from "./sequelize.js";
import { User } from "../models/user.js";

async function initLoginData() {
  try {
    console.log("로그인 테스트용 DB 초기화 중...");

    // 테이블 생성 (필요 시 기존 삭제)
    await sequelize.sync({ force: true });
    console.log("User 테이블 생성 완료");

    // 관리자 계정 생성
    const hashedPassword = await bcrypt.hash("admin", 10);
    await User.create({
      EMAIL: "email@email.com",
      PASSWORD: hashedPassword,
      NAME: "관리자",
      ROLE: "ADMIN",
    });

    console.log("관리자 계정 생성 완료");
    console.log("로그인 테스트 준비 완료");
    process.exit(0);
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
    process.exit(1);
  }
}

initLoginData();
