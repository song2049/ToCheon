require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const path = require("path");
const viewRouter = require("./view/view.router");
const authRouter = require("./auth/auth.router");
const storeRouter = require("./store/store.route");

// ✅ 절대경로로 정적 파일 경로 등록
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "html");
nunjucks.configure("views", { express: app });

app.get("/", (req, res) => {
  res.render("index.html");
});

app.use(storeRouter);
app.use(viewRouter);
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
