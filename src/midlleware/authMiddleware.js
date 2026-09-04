const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try{
    // 1. ambil header authorization
    const authHeader = req.headers.authorization

    // 2. cek apakah header authorization ada ?
    if(!authHeader) {
      return res. status(401).json({
        status: 'error',
        message: ' Token tidak ditemukan. silahkan login terlebih dahulu'
      })
    }

    // 3. format header: bearer blablabla dan ambil tokennya saja setelah kata bearer
    const token = authHeader.split(' ')[1]

    // 4. cek: apakah token ada setelah kata bearer
    if(!token) {
      return res. status(401).json({
        status: 'error',
        message: 'Format token salah. gunakan format: Bearer <token>'
      })
    }

    // 5. verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 6. jika token valid, maka simpan data user ke request
    req.user = decoded

    // 7. lanjut ke controller
    next()
  }
  catch (error) {
    // token tidak valid atau kadaluarsa
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid atau kadaluarsa. silahkan login kembali'
    })
  }
}

module.exports = authMiddleware