const bcrypt = require('bcryptjs');
const {db} =  require('../config/database')
const generateToken = require('../utils/generateToken');

// REGISTER
const registrasi = async (req, res)=> {
  try{
    const {name, email, password} = req.body

    // validasi input
    if(!name || !email || !password){
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password wajib di isikan'
      })
    }

    // cek email sudah terdaftar atau belum
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    // jika email sudah terdaftar, kembalikan error
    if(existingUser.length >0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email sudah terdaftar'
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // simpan user baru ke database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    // respon berhasil daftar user baru
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

// LOGIN
const login = async (req, res) => {
  try{
    const {email, password} = req.body

    // validasi input
    if(!email || !password){
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib di isikan'
      })
    }

    // cari user berdasarkan email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    // jika user tidak ditemukan, kembalikan error
    if(users.length === 0){
      return res.status(401).json({
        statsus: 'error',
        message: 'Email salah atau Email tidak terdaftar'
      })
    }

    const user = users[0]

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    // jika password salah, kembalikan error
    if(!isPasswordValid){
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      })
    }

    // buat token
    const token = generateToken(user.id)

    // respon berhasil login
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

module.exports = {
  registrasi,
  login
}


