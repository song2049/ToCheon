var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.53976915, 127.1240555),
        level: 3
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

let activeOverlay = null;

// 내 클라서버로 요청 보냄
const mapApi = async () => {
  try {
    const { data: result } = await axios.get("/api/stores/map");
    const data = result.data;
    console.log(result);
    
    
    // 받아온거 순회
    data.forEach(store => {
      const lat = parseFloat(store.LATITUDE);
      const lng = parseFloat(store.LONGITUDE);
      
      // 마커 생성
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: map
      });

      // 오버레이 창에 넣는 정보들
      const content = `
        <div class="custom-overlay">
          <a href="/detail/${store.ID}" class="title">${store.NAME}</a>
          <div class="category">${store.CATEGORY}</div>
          <div class="address">${store.ADDRESS}</div>
        </div>
      `;

      // 오버레이 생성
      const overlay = new kakao.maps.CustomOverlay({
        content: content,
        position: new kakao.maps.LatLng(lat, lng),
        yAnchor: 1.5,
        zIndex: 3
      });

      // 마우스 클릭하면 오버레이로
      kakao.maps.event.addListener(marker, 'click', function() {
        if (activeOverlay) activeOverlay.setMap(null);
        overlay.setMap(map);
        activeOverlay = overlay;
      });

      kakao.maps.event.addListener(map, 'click', function() {
        if (activeOverlay) {
          activeOverlay.setMap(null);
          activeOverlay = null;
        }
      });
    });

  } catch (error) {
    console.error("좌표를 불러오지 못했습니다.", error);
  }
};

mapApi();
