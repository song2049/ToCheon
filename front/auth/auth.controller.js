require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");

// 로그인 페이지 접근
const getLogin = (req, res) => {
    const { access_token } = req.cookies;
    if(access_token) {
        res.redirect("http://localhost:3000/")
    } else {
        res.render("login.html");
    }
};

// 사용자의 로컬 로그인
const postLogin = async(req, res) => {
    const { email, password } = req.body;
        try {
            const { data } = await axios.post(`http://localhost:4000/auth/login`, {
                email: email,
                password: password
            });
            
            const access_token = data.access_token;

            res.setHeader(
            "Set-Cookie",
            `access_token=${access_token}; Domain=localhost; Path=/; httpOnly; secure;`
            );

            res.status(200).json({
                message: data.message
            })
        } catch (error) {
            console.log(error);
            res.status(401).json({
                message: "로그인 실패"
            })
        };

};

// 맨처음 카카오페이지 html을 주는 곳
const getOauthLogin = (req, res) => {
    const redirectURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`
    res.redirect(redirectURL);
};

const getKakaoLogin = async(req, res) => {
    // 사용자가 로그인을 하면 코드를 날림
    try {
        const { code } = req.query;

        const { data } = await axios.post("http://localhost:4000/oauth/kakao", {
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.REDIRECT_URI,
        code: code
        });

        res.setHeader(
        "Set-Cookie",
        `access_token=${data.token}; Domain=localhost; Path=/; httpOnly; secure;`
        );

        res.redirect("http://localhost:3000/");
        
    } catch (error) {
        res.status(200).json()
    }

};

// 로그아웃을 요청할 때
const deleteLogout = (req, res) => {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            return res.status(400).json({
            message: "로그인 상태가 아닙니다."
        });
}
        const userInfo = jwt.decode(access_token);

        if (userInfo.provider === "local") {
            return res.clearCookie('access_token').json({
                message: "http://localhost:3000"
            })
        };

        if (userInfo.provider === "kakao") {
            res.clearCookie('access_token')
            const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
            const LOGOUT_REDIRECT_URI = process.env.LOGOUT_REDIRECT_URI;
            const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
            return res.json({
                message: kakaoLogoutUrl
            })
        };
        
    } catch (error) {
        res.status(401).json({
            message: "로그아웃에 실패하였습니다."
        });
    };

};


module.exports = {
    getLogin,
    postLogin,
    getOauthLogin,
    getKakaoLogin,
    deleteLogout
};
