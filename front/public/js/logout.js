const logoutBtn = document.querySelector(".logout-btn");

if(logoutBtn) {
    logoutBtn.addEventListener("click", async() => {
        
        const logoutConfirm = confirm("로그아웃 하시겠습니까?");
        if(!logoutConfirm) {return};

        try {
            const { data } = await axios.delete("/auth/logout");
            window.location.href = data.message
        } catch (error) {
            alert("로그아웃에 실패하였습니다.")
        };
    });
}