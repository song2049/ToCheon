const axios = require("axios")

const postApprove = async (req, res) => {
    try {
        const { ID, IMAGE_URL, EATING_TIME } = req.body;
        if(!ID || !IMAGE_URL || !EATING_TIME) {
            return res.status(400).json({ message: "ID, IMAGE_URL, EATING_TIME 중 값이 누락되었습니다." });
        }
        const { data } = await axios.post(`http://localhost:4000/api/admin/stores/${ID}/approve`, {
            IMAGE_URL: IMAGE_URL,
            EATING_TIME: EATING_TIME
        });

        res.status(200).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "승인 처리 불가 관리자 확인 바람." });
    };

};

const postReject = async (req, res) => {
    try {
        const { ID } = req.body;

        if(!ID) {
            return res.status(400).json({ message: "ID 값이 누락되었습니다." });
        }

        const { data } =  await axios.post(`http://localhost:4000/api/admin/stores/${ID}/reject`)

        res.status(200).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "삭제 처리 불가 관리자 확인 바람." })
    }
}


module.exports = {
    postApprove,
    postReject
};
