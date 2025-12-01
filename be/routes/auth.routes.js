const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST /api/login
router.post('/login', authController.login);

// @route   POST /api/forgot_password
router.post('/forgot_password', authController.forgotPassword);

module.exports = router;
