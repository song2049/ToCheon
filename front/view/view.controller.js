const axios = require("axios");
const path = require("path");

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