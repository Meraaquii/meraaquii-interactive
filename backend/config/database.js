const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql
  .createPool({
    //host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    //password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,

    connectionLimit: Number(process.env.DB_POOL_LIMIT) || 30,
    waitForConnections: true,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    connectTimeout: 10000,
    charset: "utf8mb4",
    timezone: "+00:00",
  })
  .promise();

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database Connected Successfully");
    conn.release();
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
  }
})();

module.exports = pool;
