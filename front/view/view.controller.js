const axios = require("axios");
const path = require("path");

// 검색요청하면 여기서 리다이렉트 하는데 이때 쿼리스트링 값으로 던져줌
const postSearch = async(req, res) => {
    const { stores } = req.body
    res.redirect(`/?stores=${encodeURIComponent(stores)}`);
};

const getReview = (req, res) => {
    res.render("detail.html");
};

module.exports = {
    getReview,
    postSearch
};