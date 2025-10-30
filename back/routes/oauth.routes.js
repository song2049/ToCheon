import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/**
 * [POST] /oauth/kakao
 * 카카오 로그인 → Access / Refresh Token JSON으로 반환
 */
router.post("/kakao", async (req, res) => {
  const { client_id, redirect_uri, code } = req.body;
  if (!code) return res.status(400).send("Authorization code not provided.");

  try {
    // 1. 카카오 Access Token 발급
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id,
        redirect_uri,
        code,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token: kakao_token } = tokenResponse.data;
    if (!kakao_token)
      return res.status(401).json({ message: "token is not defined!" });

    // 2. 카카오 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakao_token}` },
    });

    const kakaoData = userResponse.data;
    const userInfo = {
      id: kakaoData.id,
      nickname: kakaoData.properties?.nickname || "unknown",
      thumbnail: kakaoData.properties?.thumbnail_image || null,
      email: kakaoData.kakao_account?.email || null,
      provider: "kakao",
    };

    // 3. Access Token (1분)
    const accessToken = jwt.sign(
      userInfo,
      process.env.JWT_SECRET || "wnqudgus1234",
      { expiresIn: "1m" }
    );

    // 4. Refresh Token (1분)
    const refreshToken = jwt.sign(
        userInfo,
        process.env.JWT_SECRET || "wnqudgus1234",
        { expiresIn: "1m" }
    );

    // 5. 프론트가 쿠키로 저장할 수 있도록 JSON 반환
    return res.json({
      message: "Kakao login success",
      user: userInfo,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Kakao login failed:", error.message);
    res.status(500).send({
      error: "Kakao login Failed",
      message: error.response?.data || error.message,
    });
  }
});

/**
 * [POST] /oauth/refresh
 * Refresh Token으로 Access Token 재발급
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(401).json({ error: "Refresh token missing" });

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET || "wnqudgus1234"
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id, provider: decoded.provider },
      process.env.JWT_SECRET || "wnqudgus1234",
      { expiresIn: "1m" }
    );

    return res.json({
      message: "Access Token 재발급 성공",
      access_token: newAccessToken,
    });
  } catch (err) {
    console.error("OAuth refresh error:", err.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

export default router;
