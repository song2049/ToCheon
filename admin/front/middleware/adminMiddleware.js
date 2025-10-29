require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    try {
        const { access_token } = req.cookies;

        if (!access_token) {
            throw new Error("엑세스 토큰 확인 불가");
        };

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
    verifyToken
}