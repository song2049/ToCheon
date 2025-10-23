require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks")
const path = require("path");
const viewRouter = require("./view/view.router");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.use(viewRouter);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});