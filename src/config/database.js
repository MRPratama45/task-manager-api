// import package mysql2 (koneksi ke MySQL)
const mysql = require('mysql2');

// import dotenv (baca file .env)
require('dotenv').config();

// buat cenecction pool (kumpulan koneksi siap pakai)
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

// convert pool ke promise (biar bisa pakai async/await)
const db = pool.promise();

// fungsi tes koneksi 
const testConnection = async () =>{
  try{
    // querry sederhana untuk test
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

// export db & testConnection
module.exports = {
  db, 
  testConnection
}