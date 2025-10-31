require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

const refresh = async (req, res, next) => {
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
            console.log("리프레시 실패" , refreshError.message);
            res.redirect("http://localhost:3000/auth/login");
        }
    }
};

const verifyToken = (req, res, next) => {
    try {
        const { access_token } = req.cookies;
        
        const payload = jwt.verify(access_token, JWT_SECRET);
        const role = payload.role;

        if (!role || role !== `ADMIN`) {
            throw new Error("어드민 권환 확인 불가");
        };

        next();
    } catch (error) {
        console.log(error);
        res.redirect("http://localhost:3000/auth/login");
    }
};

module.exports = {
    verifyToken,
    refresh
}