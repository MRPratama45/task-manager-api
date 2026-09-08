// import package jsonwebtoken (buat & verifikasi token JWT)
const jwt = require('jsonwebtoken');

// fungsi buat token
const generateToken = (userId) => {
  return jwt.sign(
    {userId},                                 // ini adalah pyload. payload adalah data yang akan disimpan di dalam token. misal: userId, email, role, dll
    process.env.JWT_SECRET,                   // ini adalah secret key, yg di ambil dari file .env
    {expiresIn: process.env.JWT_EXPIRES_IN }  // ini adalah waktu kadaluarsa token
  )
}

// export fungsi
module.exports = generateToken;