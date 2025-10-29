require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const path = require("path");
const viewRouter = require("./view/view.router");
const authRouter = require("./auth/auth.router");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const apiRouter = require("./api/api.router.js");

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app });

app.get("/", async (req, res) => {

    // 검색하면 쿼리스트링으로 받아옴
    const stores = req.query.stores || "";
    // 로그인 된 유저인지 확인
    const { access_token } = req.cookies;
    // 로그인한 유저 정보를 담을 빈 객체
    let userInfo = {};
    if (access_token) userInfo = jwt.decode(access_token);

    // 맨 처음 `/` 으로 들어오면 1페이지부터 시작함
    const page = parseInt(req.query.page) || 1;
    // 한 페이지당 몇개를 보여줄건지 설정
    const limit = 6;
    const offset = (page - 1) * limit;

    try {
        const { data } = await axios.get("http://localhost:4000/api/stores");

        const findData = stores
        // 검색어 없으면 밑에 삼항연산자로 통째 data를 줄거고 있으면 아래의 필터로직을 거침.
            ? data.filter(store =>
                store.NAME.toLowerCase().includes(stores.toLowerCase()) ||
                store.CATEGORY.toLowerCase().includes(stores.toLowerCase()) ||
                store.HASH_TAG.toLowerCase().includes(stores.toLowerCase())
              )
            : data;

            // 해시태그 문자열이 있으면 배열로 변환, 없으면 빈 배열
            const processedData = findData.map(store => {
                const hashtags = store.HASH_TAG
                    ? store.HASH_TAG.split(' ').map(tag => tag.trim()).filter(Boolean) 
                    : [];

                return {
                    ...store,
                    hashtags
                };
            });

        //  페이지 네이션을 위해 아래와 같은 로직을 거침
        const totalItems = processedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const pageData = processedData.slice(offset, offset + limit);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            
        res.render("index.html", {
            data: pageData,
            mapData:findData,
            userInfo,
            stores,
            pages,
            page
        });

    } catch (error) {
        res.render("index.html", {
            // 문제가 있다면 빈배열 내뱉기
            data: [],
            mapData:[],
            userInfo,
            stores
        });
    }
});

// 기존에는 아래처럼 맵 마커용을 api를 따로 제작했으나 현재 검색기능과 맞추기 위해 주석처리함
// app.use(apiRouter);
app.use(viewRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
