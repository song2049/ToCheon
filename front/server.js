require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks")
const path = require("path");
const viewRouter = require("./view/view.router");
const authRouter = require("./auth/auth.router");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.get("/", (req, res) => {
    res.render("main.html");
})

app.use(viewRouter);
app.use(authRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});