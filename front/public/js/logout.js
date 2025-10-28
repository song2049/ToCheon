const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async() => {
    try {
        const { data } = await axios.delete("/auth/logout");
        alert("로그아웃이 성공적으로 진행되었습니다.");
        window.location.href = data.message
    } catch (error) {
        alert("로그아웃에 실패하였습니다.")
    };
    
});