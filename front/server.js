require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks")
const path = require("path");
const viewRouter = require("./view/view.router");
const authRouter = require("./auth/auth.router");
const { default: axios } = require("axios");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.get("/", async(req, res) => {
    try {
        const { data } = await axios.get(`http://localhost:4000/api/stores`);
        const { items, page, pageSize } = data;
        res.render("index.html", {
            items,
            page,
            pageSize
        });
    } catch (error) {
        res.render("index.html",{});
    }
})

app.use(viewRouter);
app.use(authRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});