import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev-secret";

// 로그인 (POST /auth/login)
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "이메일과 비밀번호를 입력하세요." });

    // 사용자 조회
    const user = await User.findOne({ where: { EMAIL: email } });
    if (!user)
      return res.status(401).json({ error: "존재하지 않는 사용자입니다." });

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch)
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });

    // Access Token (1분 유효)
    const accessToken = jwt.sign(
      { userId: user.ID, role: user.ROLE, email: user.EMAIL, provider: "local" },
      JWT_SECRET,
      { expiresIn: "1m" }
    );

    // Refresh Token (10분 유효)
    const refreshToken = jwt.sign(
      { userId: user.ID, role: user.ROLE, email: user.EMAIL, provider: "local" },
      REFRESH_SECRET,
      { expiresIn: "10m" }
    );

    // 응답 (프론트에서 쿠키 관리)
    res.json({
      message: "로그인 성공",
      user: {
        id: user.ID,
        email: user.EMAIL,
        name: user.NAME,
        role: user.ROLE,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "로그인 처리 중 오류 발생" });
  }
}

// 사용자 인증 확인 (GET /auth/me)
export async function me(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ error: "토큰이 없습니다." });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: ["ID", "EMAIL", "NAME", "ROLE"],
    });

    if (!user)
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

    res.json({ user });
  } catch (err) {
    console.error("me() error:", err);
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
}

// Refresh Token으로 Access Token 재발급 (POST /auth/refresh)
export async function refresh(req, res) {
  try {
    const refreshToken = req.body.refresh_token; // 프론트에서 전달받음
    if (!refreshToken)
      return res.status(401).json({ error: "리프레시 토큰이 없습니다." });

    // Refresh Token 검증
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // 새 Access Token 발급 (10분 유효)
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role, provider: "local"  },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    //console.log(`userId: ${decoded.userId}, email: ${decoded.email}, role: ${decoded.role}, provider: "local"`);
    

    res.json({
      message: "Access Token 재발급 성공",
      access_token: newAccessToken,
    });

    console.log("새 Access Token:", newAccessToken);
  } catch (err) {
    console.error("refresh error:", err);
    res.status(401).json({ error: "리프레시 토큰이 만료되었거나 유효하지 않습니다." });
  }
}

// 로그아웃 (POST /auth/logout)
export async function logout(req, res) {
  try {
    res.json({ message: "로그아웃 완료 (프론트에서 쿠키 삭제 필요)" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ error: "로그아웃 처리 중 오류 발생" });
  }
}