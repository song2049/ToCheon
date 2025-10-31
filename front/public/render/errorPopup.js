const renderStoreCreateErrorPopup = (message) => {
    return (
        `
            <div id="popup" class="popup hidden">
                <div class="popup-content">
                    <p class="popup-title">
                        <span class="highlight">${message}</span> 없습니다.
                        <p class="popup-sub">${message} 입력해주세요.</p>
                    </p>
                    <button id="popupCheckBtn" class="popup-btn">확인</button>
                </div>
            </div>
        `
    )
}