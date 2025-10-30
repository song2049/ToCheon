require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET


const loginVerifyToken = (req, res, next) => {
    // 토큰이 정상이야? 넌 그럼 못 들어가 로그인 페이지로
    try {
        const { access_token: token, refresh_token } = req.cookies;

        jwt.verify(token, JWT_SECRET);

        res.redirect("http://localhost:3000/")
    } catch (error) {
        // 토큰이 이상해? 그럼 로그인 페이지 들어가도록 해
        next();
    }
};

// 그냥 로그인하면 유지할 수 있게 리프레시만 해주는애임
const refresh = async (req, res, next) => {
    const { access_token: token, refresh_token } = req.cookies;

    try {
        // 액세스 토큰을 검증했는데 상태 괜찮다 그럼 통과
        const payload = jwt.verify(token, JWT_SECRET);
        req.userInfo = payload;

        return next();
    } catch (error) {
        // 만료가 되었다면 리프레시 시도

        try {
            const { data } = await axios.post("http://localhost:4000/auth/refresh", {
                refresh_token: refresh_token
            });

            const freshAccess_token = data.access_token;

            // 새 액세스 토큰 재설정
            res.setHeader("Set-Cookie", [
                `access_token=${freshAccess_token}; Path=/; HttpOnly; Secure`,
            ]);

            console.log("새로운 엑세스 토큰 발급완료");
            next();
        } catch (refreshError) {
            console.log("넌 리프레시 토큰마저 만료 됐다..");
            
            const userInfo = jwt.decode(token);
            // 리프레시 토큰마저 만료되면..로그아웃 진행!
            if (userInfo.provider === "local") {
                res.clearCookie('access_token');
                res.clearCookie('refresh_token');
            };
            req.userInfo = {};
            next();
        }
    }
};

// 권한
const verifyToken = async (req, res, next) => {
    const { access_token: token, refresh_token } = req.cookies;
    if (!token) {
        console.log("액세스 토큰이 없다.");
        return res.redirect("http://localhost:3000/auth/login");
    }

    try {
        // 액세스 토큰을 검증했는데 상태 괜찮다 그럼 통과
        const payload = jwt.verify(token, JWT_SECRET);
        req.userInfo = payload;

        return next();
    } catch (error) {
        // 만료가 되었다면 리프레시 시도

        try {
            const { data } = await axios.post("http://localhost:4000/auth/refresh", {
                refresh_token: refresh_token
            });

            const freshAccess_token = data.access_token;

            // 새 액세스 토큰 재설정
            res.setHeader("Set-Cookie", [
                `access_token=${freshAccess_token}; Path=/; HttpOnly; Secure`,
            ]);

            console.log("새로운 엑세스 토큰 발급완료");
            next();
        } catch (refreshError) {
            console.log("리프레시 실패", refreshError.message);
            res.redirect("http://localhost:3000/auth/login");
        }
    }
};

module.exports = {
    refresh,
    loginVerifyToken,
    verifyToken
}