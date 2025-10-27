const axios = require("axios");

const getMarker = async(req, res) => {
    const { data } = await axios.get(`http://localhost:4000/api/stores`);
    res.status(200).json({
       data
    })
}

module.exports = {
    getMarker
};