require("dotenv").config();
const PORT = process.env.PORT

const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const path = require("path");
const axios = require("axios");
const jwt = require("jsonwebtoken");

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app});

app.get("/admin", (req, res) => {
    res.render("index.html")
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})