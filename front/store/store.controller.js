const path = require("path");

const getStoreById = (req, res) => {
    res.sendFile(path.join(__dirname ,"../views/store/index.html"));
}

module.exports = {
    getStoreById
}