const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  //本地测试
  //port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'xunan_user',
  password: process.env.DB_PASSWORD || 'Xunan123',
  database: process.env.DB_NAME || 'xunan',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

module.exports = pool;