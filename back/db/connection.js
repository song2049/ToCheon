// db/connection.js
import mysql from "mysql2/promise";

const dbConfig = {
  host: "127.0.0.1",
  user: "tocheon",
  password: "block13",
  database: "tocheon_db",
  port: 3306,
};

export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("MySQL 연결 성공!");
    return connection;
  } catch (err) {
    console.error("MySQL 연결 실패:", err);
    throw err;
  }
}
