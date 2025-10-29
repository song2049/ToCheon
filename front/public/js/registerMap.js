    const chExit3 = new kakao.maps.LatLng(37.538708, 127.124550);
    const mapContainer = document.getElementById('map');
    const mapOption = { center: chExit3, level: 3 };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    const ps = new kakao.maps.services.Places();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    let markers = [];

    // -----------------------------
    // 1. 페이지 로드 시 자동으로 맛집 검색
    // -----------------------------
    window.addEventListener('load', () => {
        // Kakao API: categorySearch('FD6') = 음식점 카테고리
        ps.categorySearch('FD6', placesSearchCB, {
            location: chExit3,
            radius: 500
        });
    });

    // -----------------------------
    // 2. 검색 이벤트 핸들러
    // -----------------------------
    document.querySelector('.create-header-search > form').addEventListener('submit', (e) => {
        e.preventDefault();
        searchPlaces();
    });

    const searchPlaces = () => {
        const keyword = document.querySelector('#keyword').value.trim();
        if (!keyword) {
            alert('검색어를 입력해주세요!');
            return;
        }

        clearMarkers();

        ps.keywordSearch(keyword, placesSearchCB, {
            location: chExit3,
            radius: 500,
        });
    };

    // -----------------------------
    // 3. 검색 결과 콜백
    // -----------------------------
    const placesSearchCB = (data, status, pagination) => {
        if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();

            data.forEach(place => {
                displayMarker(place);
                bounds.extend(new kakao.maps.LatLng(place.y, place.x));
            });

            // 현재 페이지 외의 추가 페이지 있으면 재귀적으로 호출
            if (pagination.hasNextPage) {
                pagination.nextPage(); // 다음 페이지 요청
            } else {
                // 모든 페이지 불러온 뒤 지도 범위 조정
                map.setBounds(bounds);
            }

        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('반경 500m 이내에 결과가 없습니다.');
            clearMarkers();
        } else {
            console.error('검색 실패:', status);
        }
    };


    // -----------------------------
    // 4. 마커 표시
    // -----------------------------
    const displayMarker = (place) => {
        const marker = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(place.y, place.x)
        });

        kakao.maps.event.addListener(marker, 'click', () => {
            const content = `
                <div class="custom-overlay">
                    <a href="/store/create?lat=${place.y}&lng=${place.x}" class="title">등록하기</a>
                    <div class="title">${place.place_name}</div>
                    <div class="category">${place.road_address_name ? place.road_address_name : place.address_name}</div>
                    <div class="address">${place.place_url}</div>
                </div>
            `;
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
        });
    };

    // -----------------------------
    // 5. 마커 초기화
    // -----------------------------
    const clearMarkers = () => {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    };

    // -----------------------------
    // 6. 반경 표시 (시각화)
    // -----------------------------
    const circle = new kakao.maps.Circle({
        center: chExit3,
        radius: 500,
        strokeWeight: 2,
        strokeColor: '#007aff',
        strokeOpacity: 0.8,
        fillColor: '#aaddff',
        fillOpacity: 0.2
    });
    circle.setMap(map);