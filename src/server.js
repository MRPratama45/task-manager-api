// import package express (framework web)
const express = require('express');

// import package cors (agar API dapat di akses dari domain lain)
const cors = require('cors');

// import package helmet (keamanan HTTP Headers)
const helmet = require('helmet');

// import dotenv (baca file .env)
require('dotenv').config();

// import fungsi testConnection dari config/database.js
const {testConnection} = require('./config/database');

// import initDatabase (untuk di railyway)
const initDatabase = require('./config/initDatabase');

// import routes
const authRoutes =  require('./routes/authRoutes')
const testRoutes = require('./routes/testRoutes') // untuk tes route yang diproteksi dengan authMiddleware
const taskRoutes = require('./routes/taskRoutes')

// buat aplikasi express
const app = express();

// ambil port dari .env, default 5000
const PORT = process.env.PORT || 5000;


// middleware (berjalan di setiap request)
app.use(helmet());                                  // keamanan headers
app.use(cors());                                    // izinkan cross origin, agar bisa diakses dari domain lain
app.use(express.json());                            // agar bisa membaca data json/ parse json body
app.use(express.urlencoded({ extended: true}));     // parse form data, agar bisa membaca data form

// tes route utama (test server jalan)
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is Running !!!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});


// health cek route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// fungsi start server
const startServer = async () => {
  // tes koneksi database
  const isConnected = await testConnection();

  // buat tabel otomatis jika belum ada di railways
  const isInit = await initDatabase();

  if(isConnected && isInit){
    // database berhasil -> jalankan server
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })  
  } else {
    // database gagal -> hentikan server
    console.log('Server tidak dapat dijalankan karena koneksi database gagal');
    process.exit(1); // keluar dari proses dengan kode kesalahan
  }
  
}

// hubungkan routes ke endpoint
app.use('/api/auth', authRoutes);   // semua /api/auth/* -> authRoutes
app.use('/api/test', testRoutes);   // semua /api/test/* -> testRoutes
app.use('/api/tasks', taskRoutes);  // semua /api/tasks/* -> taskRoute



startServer();



/**
 * // default fungsi start server sebelum deploy ke railway
const startServer = async () => {
  // tes koneksi database
  const isConnected = await testConnection();

  if(isConnected){
    // database berhasil -> jalankan server
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })  
  } else {
    // database gagal -> hentikan server
    console.log('Server tidak dapat dijalankan karena koneksi database gagal');
    process.exit(1); // keluar dari proses dengan kode kesalahan
  }
  
}
 */