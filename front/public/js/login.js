const loginLocal = document.querySelector(".login-local");

console.log(loginLocal);


loginLocal.addEventListener("submit", async(e) => {
    e.preventDefault();
    try {
        // 인풋정보 담아서 body로 보내주기
        const { data } = await axios.post(`http://192.168.0.191:4000/api/stores/1/map`, {
            userEmail: e.target.userEmail.value,
            userPw: e.target.userPw.value,
        });
        alert(data.message)
        // 성공하면 메인페이지
        window.location.href = "http://192.168.0.191:4000/"
    } catch (error) {
        alert(error.response.data.message || "이메일 또는 비밀번호가 틀렸습니다."); 
    }
})