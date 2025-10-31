const axios = require("axios");
const jwt = require("jsonwebtoken");

const postApprove = async (req, res) => {
    try {
        
        const { ID, IMAGE_URL, EATING_TIME, CATEGORY } = req.body;
        if (!ID || !IMAGE_URL || !EATING_TIME || CATEGORY) {
            return res.status(400).json({ message: "ID, IMAGE_URL, EATING_TIME, CATEGORY 중 값이 누락되었습니다." });
        }
        const { data } = await axios.post(`http://localhost:4000/api/admin/stores/${ID}/approve`, {
            IMAGE_URL: IMAGE_URL,
            EATING_TIME: EATING_TIME,
            CATEGORY: CATEGORY
        });

        res.status(200).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "승인 처리 불가 관리자 확인 바람." });
    };

};

const postReject = async (req, res) => {
    try {
        const { ID } = req.body;

        if (!ID) {
            return res.status(400).json({ message: "ID 값이 누락되었습니다." });
        }

        const { data } = await axios.post(`http://localhost:4000/api/admin/stores/${ID}/reject`)

        res.status(200).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "삭제 처리 불가 관리자 확인 바람." })
    }
}

const deleteLogout = (req, res) => {
    try {
        const { access_token } = req.cookies;
        console.log(access_token);

        if (!access_token) {
            return res.status(400).json({
                message: "로그인 상태가 아닙니다."
            });
        }
        const userInfo = jwt.decode(access_token);

        if (userInfo.provider === "local") {
            return res.clearCookie('access_token'),
                res.clearCookie('refresh_token').json({
                    message: "http://localhost:3000/auth/login"
                })
        };

    } catch (error) {
        res.status(401).json({
            message: "로그아웃에 실패하였습니다."
        });
    };

};


module.exports = {
    postApprove,
    postReject,
    deleteLogout
};
