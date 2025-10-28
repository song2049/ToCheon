const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async() => {
    try {
        const { data } = await axios.delete("/auth/logout");
        window.location.href = data.message
    } catch (error) {
        alert("로그아웃에 실패하였습니다.")
    };
    
});