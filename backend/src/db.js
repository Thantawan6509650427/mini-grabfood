import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mini_grabfood",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection on startup
if (process.env.NODE_ENV !== "test") {
  pool.getConnection()
    .then(connection => {
      console.log("✓ Database pool created");
      connection.release();
    })
    .catch(err => {
      console.error("✗ Database pool creation failed:", err.message);
    });
}

export default pool;