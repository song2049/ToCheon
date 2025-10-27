const axios = require("axios");

// 기존에는 아래처럼 맵 마커용을 api를 따로 제작했으나 현재 검색기능과 맞추기 위해 주석처리함
// const getMarker = async(req, res) => {
//     const { data } = await axios.get(`http://localhost:4000/api/stores`);
//     res.status(200).json({
//        data
//     })
// };


module.exports = {
    getMarker
};