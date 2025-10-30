// 맛집 등록 성공했을 때
const renderStoreCreateSuccessPopup = () => {
    return (
        `
            <div id="successPopup" class="popup hidden">
                <div class="popup-content">
                <p class="popup-title">
                    등록이 <span class="highlight">완료</span> 되었습니다.
                </p>
                <p class="popup-sub">관리자의 승인을 기다려주세요.</p>
                <button id="popupCheckBtn" class="popup-btn">확인</button>
                </div>
            </div>
        `
    )
}