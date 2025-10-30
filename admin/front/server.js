require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const path = require("path");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dashboardRouter = require("./dashboard/datshboard.router.js");
const { verifyToken, refresh } = require("./middleware/adminMiddleware.js");

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.get("/admin", refresh, verifyToken, async(req, res) => {
    try {

        // 페이지 네이션 정의
        const stores = req.query.stores || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // 승인 대기
        const { data: waiting } = await axios.get("http://localhost:4000/api/admin/stores/pending");
        // 승인된 상점
        const { data: approval } = await axios.get("http://localhost:4000/api/stores");

        // 받아온 데이터 상점 ID 작은 -> 큰 순서로 정렬
        const waitingData = waiting.items.sort((a, b) => a.ID - b.ID);
        
        // 어드민 상단 갯수들
        const waitingNum = waiting.items.length;
        const approvalNum = approval.length;

        // 페이지 네이션 작업
        const totalItems = waitingData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const pageData = waitingData.slice(offset, offset + limit);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        res.render("index.html",{
            stores,
            waitingData,
            waitingNum,
            approvalNum,
            pageData,
            pages,
            page
        })
    } catch (error) {
        res.render("index.html",{
            pageData: []
        })
    }
});

app.use(dashboardRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})