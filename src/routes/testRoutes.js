const express = require('express');
const authMiddleware = require('../midlleware/authMiddleware');

const router = express.Router();

// route yg diproteksi dengan authMiddleware
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    message: 'Anda berhasil mengakses route yang diproteksi',
    user: req.user
  })
})

// route publik tanpa proteksi
router.get('/public', (req, res) => {
  res.json({
    status: 'success',
    message: 'Ini adalah route publik tanpa proteksi'
  })
})

module.exports = router;