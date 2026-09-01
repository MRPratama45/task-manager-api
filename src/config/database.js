const mysql = require('mysql2');
require('dotenv').config();

// buat cenecction pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// convert pool ke promise untuk async/await
const db = pool.promise();

// tes koneksi 
const testConnection = async () =>{
  try{
    const [rows] = await db.query('SELECT 1 + 1 AS result')
    console.log('Database Connected Successfully');
    console.log('Test query result:',rows[0].result);
    return true
  }
  catch(err){
    console.log('Database tidak terhubung, error: ', err.message);
    return false
  }
};

module.exports = {
  db, 
  testConnection
}