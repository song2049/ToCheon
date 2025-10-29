// front/store/store.controller.js
const path = require("path");
const axios = require("axios");

const getStoreById = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/store/index.html"));
};

const getCreate = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // 1) 위경도 값이 없으면 step1 페이지로
    if (!lat || !lng) {
      return res.sendFile(
        path.join(__dirname, "../views/store/create/step1.html")
      );
    }

    // 2) 카카오맵 장소 검색 (좌표 기반)
    const response = await axios.get("https://dapi.kakao.com/v2/local/search/category.json", {
      headers: { Authorization: `KakaoAK ${process.env.REST_API_KEY}` },
      params: {
        category_group_code: "FD6", // 음식점 카테고리
        x: lng,
        y: lat,
        radius: 50, // 반경 50m 내 검색 (정확한 매칭)
        sort: "distance"
      },
    });

    const storeData = response.data.documents[0]; // 가장 가까운 가게 하나

    if (!storeData) {
      return res.render("store/create/step2.html", {
        store: {
          place_name: "가게 정보를 불러올 수 없습니다",
          address_name: "",
          road_address_name: "",
          phone: "",
        },
      });
    }

    // 3) step2.html로 렌더링
    res.render("store/create/step2.html", { store: storeData });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "값을 불러오지 못했습니다." });
  }
};

const postCreate = (req, res) => {
  const {...rest} = req.body;
  res.json(rest)
}

module.exports = {
  getStoreById,
  getCreate,
  postCreate
};
