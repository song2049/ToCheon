require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const path = require("path");
const viewRouter = require("./view/view.router");
const authRouter = require("./auth/auth.router");
const axios = require("axios");
const jwt = require("jsonwebtoken");

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.get("/", async (req, res) => {
    const stores = req.query.stores || "";
    const { access_token } = req.cookies;
    let userInfo = {};
    if (access_token) userInfo = jwt.decode(access_token);

    try {
        const { data } = await axios.get("http://localhost:4000/api/stores");

        const findData = stores
            ? data.filter(store =>
                store.NAME.toLowerCase().includes(stores.toLowerCase()) ||
                store.CATEGORY.toLowerCase().includes(stores.toLowerCase()) ||
                store.HASH_TAG.toLowerCase().includes(stores.toLowerCase())
              )
            : data;

        res.render("index.html", {
            data: findData,
            userInfo
        });
    } catch (error) {
        res.render("index.html", {
            data: [],
            userInfo
        });
    }
});

app.use(viewRouter);
app.use(authRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});