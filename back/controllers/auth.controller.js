import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// 로그인 처리 (POST /auth/login)
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "이메일과 비밀번호를 입력하세요." });

    // DB 조회
    const users = await query("SELECT * FROM TB_USER WHERE EMAIL = ?", [email]);
    if (users.length === 0)
      return res.status(401).json({ error: "존재하지 않는 사용자입니다." });

    const user = users[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch)
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });

    // JWT 생성
    const token = jwt.sign(
      { userId: user.ID, role: user.ROLE, email: user.EMAIL },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 응답 반환 (토큰 포함)
    res.json({
      message: "로그인 성공",
      user: {
        id: user.ID,
        email: user.EMAIL,
        name: user.NAME,
        role: user.ROLE,
      },
      access_token: token, // JWT 토큰 추가
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

    const rows = await query(
      "SELECT ID, EMAIL, NAME, ROLE FROM TB_USER WHERE ID = ?",
      [decoded.userId]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("me() error:", err);
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
}

// 로그아웃 (POST /auth/logout)
export async function logout(req, res) {
  res.json({ message: "로그아웃 완료 (프론트에서 토큰 제거 필요)" });
}
