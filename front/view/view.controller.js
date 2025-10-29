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
        
        // 백엔드 API 호출 (백틱으로 수정)
        const response = await axios.get(`http://localhost:4000/api/stores/${storeId}`);
        const store = response.data;
        
        const response2 = await axios.get(`http://localhost:4000/api/stores/${storeId}/review-stats`);
        const stats = response2.data;
        
        // 평균 계산
        const avgTaste = parseFloat(stats.avg_taste) || 0;
        const avgPrice = parseFloat(stats.avg_price) || 0;
        const avgService = parseFloat(stats.avg_service) || 0;
        const avgTotal = ((avgTaste + avgPrice + avgService) / 3).toFixed(1);
        
        // Nunjucks 템플릿에 데이터 전달
        res.render('detail.html', {
            name: store.NAME,
            category: store.CATEGORY,
            address: store.ADDRESS,
            telNumber: store.PHONE,  // PHONE 확인
            description: store.DESCRIPTION,
            eatingTime: store.EATING_TIME,
            hashTag: store.HASH_TAG,
            latitude: store.LATITUDE,
            longitude: store.LONGITUDE,
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