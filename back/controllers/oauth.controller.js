// 사용하지 않음 (프론트 서버에서 처리)
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";

dotenv.config();

export const kakaoLogin = async (req, res) => {
  try {
    // [BE-1] 프론트서버가 전달한 인가코드(code)와 redirectUri 수신
    const { code, redirectUri } = req.body;
    if (!code || !redirectUri) {
      return res.status(400).json({ message: "Missing code or redirectUri" });
    }

    // 1. 인가코드로 Access Token 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: redirectUri,
        code: code,
        client_secret: process.env.KAKAO_CLIENT_SECRET || "",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) throw new Error("No access token received");

    // 2. 카카오 API 서버로 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoData = userResponse.data;
    const kakaoId = kakaoData.id.toString();
    const kakaoEmail =
      kakaoData.kakao_account?.email || `${kakaoId}@kakao-user.com`;
    const kakaoName =
      kakaoData.kakao_account?.profile?.nickname || "Kakao User";

    // 3. DB에 사용자 존재 여부 확인
    let user = await User.findOne({ where: { KAKAO_ID: kakaoId } });
    if (!user) {
      user = await User.create({
        EMAIL: kakaoEmail,
        KAKAO_ID: kakaoId,
        NAME: kakaoName,
        ROLE: "USER",
      });
    }

    // 4. JWT 생성
    const jwtToken = jwt.sign(
      {
        id: user.ID,
        email: user.EMAIL,
        name: user.NAME,
        role: user.ROLE,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 5. 클라이언트에 전달
    return res.status(200).json({
      message: "카카오 로그인 성공",
      user: {
        id: user.ID,
        email: user.EMAIL,
        name: user.NAME,
        role: user.ROLE,
      },
      access_token: jwtToken,
      provider: "kakao",
    });
  } catch (err) {
    console.error("kakaoLogin error:", err);
    res.status(500).json({ message: "카카오 로그인 실패", error: err.message });
  }
};
