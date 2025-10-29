// front/store/store.controller.js
const path = require("path");
const axios = require("axios");

const getStoreById = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store/index.html"));
};

const getCreate = async (req, res) => {
  try {
    const { lat, lng, name } = req.query;

    if (!lat || !lng) {
      return res.sendFile(path.join(__dirname, "../views/store/create/step1.html"));
    }

    // place_name 기반으로 검색 (이름 매칭)
    const response = await axios.get("https://dapi.kakao.com/v2/local/search/keyword.json", {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
      params: { query: name, x: lng, y: lat, radius: 100, sort: "accuracy" },
    });

    const storeData = response.data.documents[0];
    res.render("store/create/step2.html", { store: storeData || {} });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "값을 불러오지 못했습니다." });
  }
};


const postCreate = (req, res) => {
  try {
    const {...rest} = req.body;
    console.log(rest);
    res.json(rest);
    console.log(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버에 문제가 생겼습니다."})
  }
}

module.exports = {
  getStoreById,
  getCreate,
  postCreate
};
