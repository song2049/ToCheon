const axios = require("axios");
const path = require("path");

// 검색요청하면 여기서 리다이렉트 하는데 이때 쿼리스트링 값으로 던져줌
const postSearch = async (req, res) => {
    const { stores } = req.body
    res.redirect(`/?stores=${encodeURIComponent(stores)}`);
};

const getDetail = async (req, res) => {
    const storeId = req.params.id;

    if (!storeId) {
        return res.status(400).send('Store ID가 필요합니다');
    }

    try {
        const [storeMapRes, storeInfo, storeStat, storeMenuRes] = await Promise.all([
            axios.get(`http://localhost:4000/api/stores/${storeId}/map`),
            axios.get(`http://localhost:4000/api/stores/${storeId}`),
            axios.get(`http://localhost:4000/api/stores/${storeId}/review-stats`),
            axios.get(`http://localhost:4000/api/stores/${storeId}/menu`)
        ]);

        const map = storeMapRes.data;
        const store = storeInfo.data;
        const stats = storeStat.data;
        const menu = storeMenuRes.data;

        const avgTaste = parseFloat(stats.avg_taste) || 0;
        const avgPrice = parseFloat(stats.avg_price) || 0;
        const avgService = parseFloat(stats.avg_service) || 0;
        const avgTotal = ((avgTaste + avgPrice + avgService) / 3).toFixed(1);

        res.render('detail.html', {
            title: map.NAME,
            content: menu[0].NAME,
            avgTotal: avgTotal,
            reviewCount: stats.review_count,

            telNumber: store.TEL_Number,
            address: store.ADDRESS,
            eatingTime: store.EATING_TIME,
            hashTag: store.HASH_TAG,

            avgTaste: avgTaste.toFixed(1),
            avgPrice: avgPrice.toFixed(1),
            avgService: avgService.toFixed(1),

            storeMenu: menu,
        });

    } catch (error) {
        console.error('Error fetching store details:', error);

        if (error.response && error.response.status === 404) {
            return res.status(404).send('요청하신 정보를 찾을 수 없습니다.');
        }

        res.status(500).send('맛집 정보를 불러오는 중 서버 오류가 발생했습니다');
    }
};

module.exports = {
    getDetail,
    postSearch
};