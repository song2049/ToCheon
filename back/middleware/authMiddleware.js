// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ error: "로그인이 필요합니다." });

    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded를 req.user에 붙여서 이후 핸들러에서 사용
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ error: "토큰 만료" });
    return res.status(401).json({ error: "인증 실패" });
  }
}
