const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, loginUser } = require('../controllers/authController');

// /api/auth/register
router.post('/register', registerUser);

// /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

// /api/auth/login
router.post('/login', loginUser);

module.exports = router;
