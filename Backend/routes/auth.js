const express = require('express');
const router = express.Router();
const authController =  require('../controllers/authController');

//Đăng ký
router.post('/register', authController.register);

//Đăng nhập
router.post('/login', authController.login);

//Đăng xuất
router.post('/logout', authController.logout);

//Gửi otp
router.post('/send-otp', authController.sendOtp);

//Kiểm tra otp
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;