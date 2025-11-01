import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * [POST] /oauth/kakao
 * 카카오 로그인 Access / Refresh Token 발급
 */
export const kakaoLogin = async (req, res) => {
  const { client_id, redirect_uri, code } = req.body;
  if (!code) return res.status(400).send("Authorization code not provided.");

  try {
    // 1. 카카오 Access Token 요청
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

    // 2. 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${kakao_token}` },
    });

    const kakaoData = userResponse.data;
    const userInfo = {
      userId: kakaoData.id,
      nickname: kakaoData.properties?.nickname || "unknown",
      thumbnail: kakaoData.properties?.thumbnail_image || null,
      email: kakaoData.kakao_account?.email || null,
      role: "user",
      provider: "kakao",
    };

    // 3. Access Token (1분)
    const jwt_token = jwt.sign(userInfo, process.env.JWT_SECRET || "dev-secret", {
      expiresIn: "1m",
    });

    // 4. Refresh Token (10분)
    const refreshToken = jwt.sign(
      userInfo,
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "10m" }
    );

    // 5. 프론트로 반환
    return res.json({
      message: "Kakao login success",
      //user: userInfo,
      token: jwt_token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Kakao login failed:", error.message);
    res.status(500).send({
      error: "Kakao login Failed",
      message: error.response?.data || error.message,
    });
  }
};

/**
 * [POST] /oauth/refresh
 * Refresh Token으로 Access Token 재발급
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(401).json({ error: "Refresh token missing" });

    // 1. Refresh Token 검증
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET || "dev-secret"
    );

    // 2. 기존 kakaoLogin의 userInfo 구조 유지
    const userInfo = {
      id: decoded.id,
      nickname: decoded.nickname || "unknown",
      thumbnail: decoded.thumbnail || null,
      email: decoded.email || null,
      role: decoded.role || "user",
      provider: decoded.provider || "kakao",
    };

    // 3. Access Token 재발급 (1분)
    const newAccessToken = jwt.sign(
      userInfo,
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1m" }
    );

    // 4. 프론트로 반환
    return res.json({
      message: "Access Token 재발급 성공",
      access_token: newAccessToken,
      //user: userInfo,
    });
  } catch (err) {
    console.error("OAuth refresh error:", err.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

/**
 * [GET] /oauth/debug
 * 인가코드 디버깅용
 */
export const kakaoDebugCode = (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error("카카오 인증 실패:", error_description);
    return res
      .status(400)
      .send(`카카오 인증 실패: ${error_description || error}`);
  }

  if (!code) {
    return res
      .status(400)
      .send("인가 코드가 전달되지 않았습니다. (code 파라미터 없음)");
  }

  console.log("인가 코드:", code);
  res.send(`인가 코드: ${code}`);
};
