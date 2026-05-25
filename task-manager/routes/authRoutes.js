const express= require('express');
const {register, login, getMe, refreshAccessToken, logout}= require('../controllers/authController');
const router= express.Router();
const protect= require('../middleware/protect');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logout);

module.exports= router;