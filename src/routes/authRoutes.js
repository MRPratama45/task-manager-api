// import express
const express = require('express');

// import controller
const {registrasi, login } = require('../controllers/authController')

// buat router
const router = express.Router();

// POST /api/auth/register -> untuk menjalankan registrasi
router.post('/registrasi', registrasi);

// POST /api/auth/login -> untuk menjalankan login
router.post('/login', login);

// export router
module.exports = router;