import mysql from "mysql2/promise";

const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "tocheon",
  password: process.env.DB_PASSWORD || "block13",
  database: process.env.DB_NAME || "tocheon_db",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(config);

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function pingDB() {
  const rows = await query("SELECT NOW() AS now");
  return rows[0].now;
}

export default pool;
