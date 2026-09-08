// import bcrypt (hash & compare password)
const bcrypt = require('bcryptjs');

// import db (koneksi db)
const {db} =  require('../config/database')

// import generateToken (buat token/JWT)
const generateToken = require('../utils/generateToken');

// ======================== REGISTER ======================
const registrasi = async (req, res)=> {
  try{
    // 1. ambil input dari body
    const {name, email, password} = req.body

    // 2. validasi: semua inputan/fields wajib diisi
    if(!name || !email || !password){
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password wajib di isikan'
      })
    }

    // 3. cek email sudah terdaftar atau belum?
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    // 3a. jika email sudah terdaftar, kembalikan error
    if(existingUser.length >0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email sudah terdaftar'
      })
    }

    // 4. hash password (10 = salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. simpan user baru ke database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    // 6. respon berhasil daftar user baru
    res.status(201).json({
      status: 'success',
      message: 'User berhasil didaftarkan',
      data: {
        id: result.insertId,
        name,
        email
      }
    })
  }
  catch (error){
    console.log('Registrasti error: ', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    })
  }
}

// ======================== LOGIN =========================
const login = async (req, res) => {
  try{
    // 1. ambil input dari body
    const {email, password} = req.body

    // 2. validasi input
    if(!email || !password){
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib di isikan'
      })
    }

    // 3. cari user berdasarkan email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    // 3a. jika user tidak ditemukan, kembalikan error
    if(users.length === 0){
      return res.status(401).json({
        statsus: 'error',
        message: 'Email salah atau Email tidak terdaftar'
      })
    }

    const user = users[0]

    // 4. cek password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    // jika password salah, kembalikan error
    if(!isPasswordValid){
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      })
    }

    // 5. buat token
    const token = generateToken(user.id)

    // 6. respon berhasil login
    res.json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      }
    })
  }
  catch (error){
    console.log('Login error: ', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    })
  }
}

// export registrasi & login
module.exports = {
  registrasi,
  login
}


