const adminBtn = document.querySelector(".admin-btn");

if(adminBtn){
    adminBtn.addEventListener("click", async () => {
        try {
            window.location.href = "http://localhost:3001/admin/"
        } catch (error) {
            alert("관리자 페이지 진입이 불가합니다.")
        };
    });
}
