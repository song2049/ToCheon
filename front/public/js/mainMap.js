var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.53976915, 127.1240555),
        level: 3
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

// 데이터

var positions = [
  {
    content: `
      <div class="custom-overlay">
        <a href="./index.html" class="title">보송회관</a>
        <div class="category">한식</div>
        <div class="rating">★★★★☆</div>
        
      </div>
    `,
    latlng: new kakao.maps.LatLng(37.53976915, 127.1240555)
  },
  {
    content: `
      <div class="custom-overlay">
        <a href="./index.html" class="title">김밥천국</a>
        <div class="category">한식</div>
        <div class="rating">★★★★☆</div>
      </div>
    `,
    latlng: new kakao.maps.LatLng(33.450936, 126.569477)
  }
];

// 마커 + 오버레이 표시
positions.forEach(pos => {
  const marker = new kakao.maps.Marker({
    position: pos.latlng,
    map: map
  });

  const overlay = new kakao.maps.CustomOverlay({
    content: pos.content,
    position: pos.latlng,
    yAnchor: 1.5, // 마커 위로 띄우기
    zIndex: 3
  });

  // 마우스오버 시 오버레이 표시
  kakao.maps.event.addListener(marker, 'mouseover', function() {
    overlay.setMap(map);
  });

  kakao.maps.event.addListener(marker, 'mouseout', function() {
    overlay.setMap(null);
  });

  // 클릭 시 페이지 이동
  kakao.maps.event.addListener(marker, 'click', function() {
    window.location.href = "./food.html";
  });
});
