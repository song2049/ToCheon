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
    // 받아온거 순회
    console.log(storesData);
    
    storesData.forEach(store => {
      // 받아온게 문자열이라 카카오api에서 인식 못할까봐 숫자형태로 바꿔줌
      const lat = Number(store.LATITUDE);
      const lng = Number(store.LONGITUDE);
      
      // 마커(파란 마커들 근데 이제 오버레이는 따로 만들어야함)
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
          <div class="DESCRIPTION">${store.DESCRIPTION}</div>
        </div>
      `;

      // 오버레이 만듬
      const overlay = new kakao.maps.CustomOverlay({
        // content가 내가 만든 정보를 기반으로 넣는것임 이건 카카오 sdk 에서 요구하는 정보들
        content: content,
        position: new kakao.maps.LatLng(lat, lng),
        yAnchor: 1.5,
        zIndex: 3,
        // 얘는 제목 클릭하면 이동하게끔 하는 설정을 키는 것
        clickable: true
      });

      // 마우스 클릭하면 오버레이를 만듬 근데 이미 마커 있으면 기존 마커 끔
      kakao.maps.event.addListener(marker, 'click', function() {
        if (activeOverlay) activeOverlay.setMap(null);
        overlay.setMap(map);
        activeOverlay = overlay;
      });
      // 지도 누르면 마커 닫혀짐 (편의성)
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
