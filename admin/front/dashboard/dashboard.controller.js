const axios = require("axios")

const postApprove = async (req, res) => {
    try {
        const { ID, IMAGE_URL, EATING_TIME } = req.body

        const { data } = await axios.post(`http://localhost:4000/api/admin/stores/${ID}/approve`, {
            IMAGE_URL: IMAGE_URL,
            EATING_TIME: EATING_TIME
        });

        res.status(200).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "승인 처리 불가 관리자 확인 바람." });
    };

};


module.exports = {
    postApprove
};
