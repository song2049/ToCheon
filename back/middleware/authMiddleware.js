// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// 쿠키 기반 + 헤더 기반 JWT 인증
export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "인증 토큰이 없습니다." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT 검증 실패:", err);
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

// 관리자만 접근 허용
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "인증되지 않은 사용자입니다." });
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "관리자 권한이 필요합니다." });
  next();
};
