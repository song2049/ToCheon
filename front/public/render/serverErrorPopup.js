const renderStoreServerErrorPopup = (message, subMessage) => {
    return (
        `
            <div id="popup" class="popup hidden">
                <div class="popup-content">
                    <p class="popup-title">
                        <span class="highlight">${message}</span>
                        <p class="popup-sub">${subMessage}</p>
                    </p>
                    <button id="popupCheckBtn" class="popup-btn">확인</button>
                </div>
            </div>
        `
    )
}