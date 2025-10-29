const path = require("path");

const getStoreById = (req, res) => {
    res.sendFile(path.join(__dirname ,"../views/store/index.html"));
}

const getCreate = (req, res) => {
    res.sendFile(path.join(__dirname ,"../views/store/create.html"));
}

module.exports = {
    getStoreById,
    getCreate
}