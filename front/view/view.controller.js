const path = require("path");

// const getLogin = (req, res) => {
//     res.render("login.html");
// };

const getReview = (req, res) => {
    res.render("detail.html");
};

module.exports = {
    getReview
};