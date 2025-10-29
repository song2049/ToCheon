const axios = require("axios");
const path = require("path");

// 검색요청하면 여기서 리다이렉트 하는데 이때 쿼리스트링 값으로 던져줌
const postSearch = async (req, res) => {
    const { stores } = req.body
    res.redirect(`/?stores=${encodeURIComponent(stores)}`);
};

const getDetail = async (req, res) => {
    try {
        const storeId = req.params.id;
        if (!storeId) {
            return res.status(400).send('Store ID가 필요합니다');
        }

        const storeMap = await axios.get(`http://localhost:4000/api/stores/map`);
        const map = storeMap.data;

        const storeInfo = await axios.get(`http://localhost:4000/api/stores/${storeId}`);
        const store = storeInfo.data;

        const storeStat = await axios.get(`http://localhost:4000/api/stores/${storeId}/review-stats`);
        const stats = storeStat.data;

        const storeMenu = await axios.get(`http://localhost:4000/api/stores/${storeId}/menu`);
        const menu = storeMenu.data;

        const avgTaste = parseFloat(stats.avg_taste) || 0;
        const avgPrice = parseFloat(stats.avg_price) || 0;
        const avgService = parseFloat(stats.avg_service) || 0;
        const avgTotal = ((avgTaste + avgPrice + avgService) / 3).toFixed(1);

        res.render('detail.html', {
            name: store.NAME,
            telNumber: store.TEL_Number,
            description: store.DESCRIPTION,
            eatingTime: store.EATING_TIME,
            hashTag: store.HASH_TAG,
            avgTaste: avgTaste.toFixed(1),
            avgPrice: avgPrice.toFixed(1),
            avgService: avgService.toFixed(1),
            avgTotal: avgTotal,
            reviewCount: stats.review_count
        });
    } catch (error) {
        console.error('Error fetching store details:', error);
        res.status(500).send('맛집 정보를 불러오는 중 오류가 발생했습니다');
    }
};

module.exports = {
    getDetail,
    postSearch
};