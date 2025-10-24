const axios = require("axios");

const getLogin = (req, res) => {
    res.render("login.html");
};

const postLogin = async(req, res) => {
    const { email, password } = req.body;

    console.log(email, password);
        try {
            const { data } = await axios.post(`http://192.168.0.191:4000/auth/login`, {
                email: email,
                password: password
            });
            
            const access_token = data.access_token;

            res.setHeader(
            "Set-Cookie",
            `access_token=${access_token}; Domain=localhost; Path=/; httpOnly; secure;`
            );

            res.status(200).json({
                message: data.message
            })
        } catch (error) {
            console.log(error);
            res.status(401).send("인증실패")
        };

};


module.exports = {
    getLogin,
    postLogin
};


// const loginLocal = document.querySelector(".login-local");

// loginLocal.addEventListener("submit", async(e) => {
//     e.preventDefault();

//     const email = e.target.email.value
//     const password = e.target.password.value

//     if(email.length === 0 || password.length === 0) {
//         alert("이메일 또는 비밀번호를 입력해주시길 바랍니다.")
//         return
//     }
//     try {
//         // 인풋정보 담아서 body로 보내주기
//         const { data } = await axios.post(`http://192.168.0.191:4000/auth/login`, {
//             email: email,
//             password: password
//         });
//         alert(data.message)
//         // 성공하면 메인페이지
//         // window.location.href = "http://192.168.0.191:4000/"
//     } catch (error) {
//         console.log(error);
        
//         alert("이메일 또는 비밀번호가 틀렸습니다."); 
//     }
// })
