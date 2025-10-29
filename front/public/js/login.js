const loginLocal = document.querySelector(".login-local");

loginLocal.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value

    if(email.length === 0 || password.length === 0) {

        
    }

    try {
        const { data } = await axios.post("/auth/login", { email: email, password: password });
        alert(data.message);
        window.location.href = "http://localhost:3000/"
        
    } catch (error) {
        alert("로그인에 실패 하였습니다!");
    }
});