const chExit3 = new kakao.maps.LatLng(37.538708, 127.124550);
const mapContainer = document.getElementById('map');
const mapOption = { center: chExit3, level: 3 };
const map = new kakao.maps.Map(mapContainer, mapOption);

const ps = new kakao.maps.services.Places();
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
let markers = []; // [{ marker, place }]

// --------------------------------------
// 1. 초기 로드 – 반경 500m 내 맛집 검색
// --------------------------------------
window.addEventListener('load', () => {
  loadNearbyStores();
});

const loadNearbyStores = () => {
  clearMarkers();
  const keywords = ['음식점', '한식', '중식', '일식', '분식', '반찬가게']; // 음식점 + 카페
  keywords.forEach((value) => {
    ps.keywordSearch(value, handleCategoryResults, {
      location: chExit3,
      radius: 500,
    });
  })
}

// --------------------------------------
// 2. 검색 이벤트 핸들러
// --------------------------------------
document
  .querySelector('.create-header-search > form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.querySelector('#keyword').value.trim();
    if (!keyword) {
      window.location.href = "/store/create";
      return;
    }
    searchPlaces(keyword);
  });

const searchPlaces = (keyword) => {
  clearMarkers();
  ps.keywordSearch(keyword, handleKeywordResults, {
    location: chExit3,
    radius: 500,
  });
}

// --------------------------------------
// 3-A. 카테고리 검색 콜백 (초기 로드)
// --------------------------------------
const handleCategoryResults = (data, status, pagination) => {
  if (status === kakao.maps.services.Status.OK) {
    renderPlacesOnMapA(data);

    // 다음 페이지가 있으면 계속 불러오기 (초기 로드 전용)
    if (pagination.hasNextPage) {
      pagination.nextPage();
    }
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    console.log('반경 내 음식점이 없습니다.');
  } else {
    console.error('카테고리 검색 실패:', status);
  }
}

// --------------------------------------
// 3-B. 키워드 검색 콜백 (검색 실행 시)
// --------------------------------------
const handleKeywordResults = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    renderPlacesOnMapB(data);
    
    // ✅ 첫 번째 결과를 자동으로 포커스 & 오버레이 열기
    if (markers.length > 0) {
      openInfoFor(0); // 0번 인덱스
    }
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 없습니다.');
    window.location.href = "/store/create";
  } else {
    console.error('검색 실패:', status);
  }
}

// --------------------------------------
// 4-A. 초기 로드 때
// --------------------------------------
const renderPlacesOnMapA = (data) => {
  const bounds = new kakao.maps.LatLngBounds();

  data.forEach((place) => {
    displayMarker(place); // 생성하며 markers에 push
    const pos = new kakao.maps.LatLng(place.y, place.x);
    bounds.extend(pos);
  });
}

// --------------------------------------
// 4-B. 검색 후, map.setBounds(bounds); => 포커스
// --------------------------------------
const renderPlacesOnMapB = (data) => {
  const bounds = new kakao.maps.LatLngBounds();

  data.forEach((place) => {
    displayMarker(place); // 생성하며 markers에 push
    const pos = new kakao.maps.LatLng(place.y, place.x);
    bounds.extend(pos);
  });

  map.setBounds(bounds);
}


// --------------------------------------
// 5. 마커 표시 (place-마커 쌍으로 저장)
// --------------------------------------
const displayMarker = (place) => {
  const position = new kakao.maps.LatLng(place.y, place.x);

  const marker = new kakao.maps.Marker({
    map,
    position,
  });

  const index = markers.push({ marker, place }) - 1;

  kakao.maps.event.addListener(marker, 'click', () => {
    openInfoFor(index);
  });

  return index;
}

// --------------------------------------
// 6. 인포윈도우 열기 (단일 진입점)
// --------------------------------------
const openInfoFor = (index) => {
  const item = markers[index];
  if (!item) return;

  const { marker, place } = item;
  const position = new kakao.maps.LatLng(place.y, place.x);

  map.panTo(position);

  const content = createInfoContent(place);
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// --------------------------------------
// 7. 인포윈도우 콘텐츠 생성
// --------------------------------------
const createInfoContent = (place) => {
  console.log(place);
  
  return `
    <div class="custom-overlay">
      <a href="/store/create?lat=${place.y}&lng=${place.x}&name=${encodeURIComponent(place.place_name)}" class="title">등록하기</a>
      <div class="title">${place.place_name}</div>
      <div class="category">
        ${place.road_address_name ? place.road_address_name : place.address_name}
      </div>
      <div class="address">
        <a href="${place.place_url}" target="_blank">${place.place_url}</a>
      </div>
    </div>
  `;
}

// --------------------------------------
// 8. 마커 초기화 (인포윈도우도 닫기)
// --------------------------------------
const clearMarkers = () => {
  infowindow.close();
  markers.forEach(({ marker }) => marker.setMap(null));
  markers = [];
}

// --------------------------------------
// 9. 반경 시각화 + 맵 클릭 시 오버레이 닫기
// --------------------------------------
const circle = new kakao.maps.Circle({
  center: chExit3,
  radius: 500,
  strokeWeight: 2,
  strokeColor: '#007aff',
  strokeOpacity: 0.8,
  fillColor: '#aaddff',
  fillOpacity: 0.2,
});
circle.setMap(map);

// 지도 클릭 시 열린 인포윈도우 닫기
kakao.maps.event.addListener(map, 'click', () => {
  infowindow.close();
});
