// import express
const express = require('express');

// import authMiddleware (middleware auth)
const authMiddleware = require('../middleware/authMiddleware');

// buat router
const router = express.Router();

// route yg diproteksi dengan authMiddleware sehungga wajib login
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    message: 'Anda berhasil mengakses route yang diproteksi',
    user: req.user
  })
})

// route publik tanpa proteksi (tanpa login)
router.get('/public', (req, res) => {
  res.json({
    status: 'success',
    message: 'Ini adalah route publik tanpa proteksi'
  })
})

// export router
module.exports = router;