const requestBtn = document.querySelector(".request-btn");
const logoutBtn = document.querySelector(".logout-btn");
const mainBtn = document.querySelector(".main-btn");

// 맛집 등록으로 가기
requestBtn.addEventListener("click", () => {
    try {
        window.location.href = "http://localhost:3000/store/create"
    } catch (error) {
        console.log(error);
        alert("맛집 등록 페이지 이동에 실패 하였습니다.", error)
    }
});

// 로그아웃 하기
logoutBtn.addEventListener("click", async() => {
    
    const logoutConfirm = confirm("로그아웃 하시겠습니까?");
    if(!logoutConfirm) {return};

    try {
        const { data } = await axios.delete("/admin/logout");
        window.location.href = data.message
    } catch (error) {
        alert("로그아웃에 실패하였습니다.")
    };
    
});

// 메인페이지로 가기

mainBtn.addEventListener("click", () => {
    try {
        window.location.href = "http://localhost:3000/"
    } catch (error) {
        console.log(error);
        alert("메인 페이지 이동에 실패 하였습니다.", error)
    }
});