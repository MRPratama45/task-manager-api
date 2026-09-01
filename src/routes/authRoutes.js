const express = require('express');
const {registrasi, login } = require('../controellers/authController')

const router = express.Router();

// POST /api/auth/register
router.post('/registrasi', registrasi);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;