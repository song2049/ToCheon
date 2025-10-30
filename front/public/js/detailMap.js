const path = window.location.pathname;
const parts = path.split('/');
const id = parts[2]


const mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(37.53976915, 127.1240555),
        level: 3
    };

const map = new kakao.maps.Map(mapContainer, mapOption);

let activeOverlay = null;

const detailMapApi = async () => {
    try {
        const { data } = await axios.get(`http://localhost:4000/api/stores/${id}/map`);

        if (!data) {
            throw new Error("맛집 위치 정보를 찾을 수 없습니다!");
        }

        const lat = Number(data.LATITUDE);
        const lng = Number(data.LONGITUDE);
        const storeName = data.NAME;
        const storeAddress = data.ADDRESS;

        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            map: map
        });

        const content = `
            <div class="custom-overlay">
                <a class="title">${storeName}</a>
                <div class="address">${storeAddress}</div>
            </div>
        `
        // 얘는 상시발동 오버레이
        const overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: new kakao.maps.LatLng(lat, lng),
            yAnchor: 1.7,
            zIndex: 3,
            map: map,
        });
        // 얘는 마커 누르면 켜지는 오버레이
        kakao.maps.event.addListener(marker, 'click', function () {
            activeOverlay = overlay;
            if (activeOverlay) activeOverlay.setMap(null);
            overlay.setMap(map);
        });
        // 얘는 지도 클릭하면 꺼지는 오버레이
        kakao.maps.event.addListener(map, 'click', function () {
            activeOverlay = overlay
            if (activeOverlay) {
                activeOverlay.setMap(null);
                activeOverlay = null;
            }
        });

    } catch (error) {
        console.log(error);
    }
};

detailMapApi();