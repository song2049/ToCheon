// controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const COOKIE_NAME = "access_token";
const COOKIE_MAX_AGE = 60 * 60 * 1000; // 60 분 (일단 이렇게하고 추후에 리프레시 토큰 작업예정)

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "이메일과 비밀번호를 입력하세요." });

  try {
    const users = await query(
      "SELECT ID, EMAIL, PASSWORD, NAME, ROLE FROM TB_USER WHERE EMAIL = ?",
      [email]
    );

    if (users.length === 0)
      return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const user = users[0];
    const hash = user.PASSWORD ?? user.password;
    if (!hash)
      return res.status(401).json({ error: "로컬 비밀번호가 설정되어 있지 않습니다." });

    const ok = await bcrypt.compare(password, hash);
    if (!ok) return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const payload = { userId: user.ID, email: user.EMAIL, name: user.NAME, role: user.ROLE };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    // 발급 (개발환경에서는 secure:false, 배포시 true)
    const secureFlag = process.env.NODE_ENV === "production";

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: "lax", // 필요 시 "strict" 또는 "none" 고려 (none 쓰면 secure:true 필요)
      maxAge: COOKIE_MAX_AGE,
    });

    // 프론트가 토큰을 직접 읽진 않으므로 user 기본 정보만 반환
    res.json({
      message: "로그인 성공",
      user: { id: user.ID, email: user.EMAIL, name: user.NAME, role: user.ROLE },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "서버 오류" });
  }
}

export async function me(req, res) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ error: "로그인이 필요합니다." });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") return res.status(401).json({ error: "토큰이 만료되었습니다." });
      return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
    }

    const users = await query("SELECT ID, EMAIL, NAME, ROLE FROM TB_USER WHERE ID = ?", [decoded.userId]);
    if (users.length === 0) return res.status(404).json({ error: "사용자 정보를 찾을 수 없습니다." });

    res.json({ user: users[0], message: "인증 성공" });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ error: "서버 오류" });
  }
}

export async function logout(req, res) {
  // 쿠키 제거 (path, domain 등 옵션을 발급시와 동일하게 지정하면 확실히 제거됨)
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "로그아웃 완료" });
}
