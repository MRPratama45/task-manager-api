const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const {testConnection} = require('./config/database');
const authRoutes =  require('./routes/authRoutes')

const app = express();
const PORT = process.env.PORT || 5000;


// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// tes route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is Running !!!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});


// routes
app.use('/api/auth', authRoutes);

// health cek route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})


// start server
const startServer = async () => {
  // tes koneksi database
  const isConnected = await testConnection();

  if(isConnected){
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })  
  } else {
    console.log('Server tidak dapat dijalankan karena koneksi database gagal');
    process.exit(1); // keluar dari proses dengan kode kesalahan
  }
  
}

startServer();