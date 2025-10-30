const axios = require("axios");
const path = require("path");
const multer = require('multer');
const jwt = require("jsonwebtoken");


// 검색요청하면 여기서 리다이렉트 하는데 이때 쿼리스트링 값으로 던져줌
const postSearch = async (req, res) => {
    const { stores } = req.body
    res.redirect(`/?stores=${encodeURIComponent(stores)}`);
};

const getDetail = async (req, res) => {
    const storeId = req.params.id;

    const { access_token } = req.cookies;
    let userInfo = {};
    if (access_token) userInfo = jwt.decode(access_token);

    if (!storeId) {
        return res.status(400).send('Store ID가 필요합니다');
    }

    try {
        const [storeMapRes, storeInfo, storeStat, storeMenuRes, reviewsRes] = await Promise.all([
            axios.get(`http://localhost:4000/api/stores/${storeId}/map`),
            axios.get(`http://localhost:4000/api/stores/${storeId}`),
            axios.get(`http://localhost:4000/api/stores/${storeId}/review-stats`),
            axios.get(`http://localhost:4000/api/stores/${storeId}/menu`),
            axios.get(`http://localhost:4000/api/reviews/${storeId}`)
        ]);

        const map = storeMapRes.data;
        const store = storeInfo.data;
        const stats = storeStat.data;
        const menu = storeMenuRes.data;
        const reviews = reviewsRes.data.items || [];

        const avgTaste = parseFloat(stats.avg_taste) || 0;
        const avgPrice = parseFloat(stats.avg_price) || 0;
        const avgService = parseFloat(stats.avg_service) || 0;
        const avgTotal = ((avgTaste + avgPrice + avgService) / 3).toFixed(1);
        // 리뷰 사진들만 가져옴
        const photoUrls = reviews.flatMap(review =>
            review.Pictures.map(pic => pic.URL)
        );

        res.render('detail.html', {
            storeId: storeId,

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
            reviews: reviews,
            photoUrls: photoUrls,
            userInfo
        });

    } catch (error) {
        console.error('Error fetching store details:', error);

        if (error.response && error.response.status === 404) {
            return res.status(404).send('요청하신 정보를 찾을 수 없습니다.');
        }

        res.status(500).send('맛집 정보를 불러오는 중 서버 오류가 발생했습니다');
    }
};

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        done(null, 'uploads/');
    },
    filename: (req, file, done) => {
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext) + '_' + Date.now() + ext;
        done(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const postReview = [upload.single('image'), async (req, res) => {
    const { taste, price, service, menu, content, store_id } = req.body;

    const imageFile = req.file;
    const { access_token } = req.cookies;
    console.log('access_token:', access_token ? '있음' : '없음');
    console.log('store_id:', store_id);
    console.log('리뷰 데이터:', { taste, price, service, menu, content });

    try {
        if (!taste || !price || !service || !menu || !content || !store_id) {
            throw new Error("필수 값이 누락 되었습니다!");

        };
        const response = await axios.post(
            `http://localhost:4000/api/reviews/${store_id}`,
            {
                point1: parseInt(taste),      // POINT_01 (맛)
                point2: parseInt(price),       // POINT_02 (가격)
                point3: parseInt(service),     // POINT_03 (친절도)
                content: content,              // CONTENT
                orderedItem: menu,             // ORDERED_ITEM
                photos: imageFile ? [imageFile.path] : []  // Picture 테이블용
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,  // Bearer 토큰 형식으로 전달
                    'Content-Type': 'application/json'
                }
            }
        )
        return res.redirect(`/detail/${store_id}`);

    }
    catch (error) {
        console.error('리뷰 등록 오류:', error.response?.data || error.message);
        res.status(500).json({ message: "리뷰 등록에 문제가 생겼습니다!" })
    }
}]

module.exports = {
    getDetail,
    postSearch,
    postReview
};