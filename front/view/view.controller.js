const path = require("path");

const getMain = (req, res) => {
    res.render("main.html");
}

const getLogin = (req, res) => {
    res.render("login.html");
}

module.exports = {
    getMain,
    getLogin
};