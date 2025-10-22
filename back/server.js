// server.js
import express from "express";
import { getConnection } from "./db/connection.js";

const app = express();
const PORT = 4000;

app.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT NOW() AS currentTime");
    res.json({
      message: "MySQL 연결 및 쿼리 성공",
      result: rows[0],
    });
    await conn.end();
  } catch (error) {
    console.error("쿼리 오류:", error);
    res.status(500).json({ error: "DB 연결 오류" });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
