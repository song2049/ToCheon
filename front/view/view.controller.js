const axios = require("axios");
const path = require("path");

const postSearch = async(req, res) => {
    try {
        const { stores } = req.body
        const { data } = await axios.get(`http://localhost:4000/api/stores`);
        
        const findData = data.filter(store => {
            return store.NAME.includes(stores);
        });

        res.render("index-Search.html",{
            data : findData
        })
    } catch (error) {
        res.render("index-Search.html",{
            data: []
        });
    };
};

const getReview = (req, res) => {
    res.render("detail.html");
};

module.exports = {
    getReview,
    postSearch
};