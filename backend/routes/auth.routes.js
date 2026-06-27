const router = require('express').Router();
const { register, verifyEmail, resendVerify, login, forgotPassword, resetPassword, getMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',              register);
router.get('/verify/:token',          verifyEmail);
router.post('/resend-verify',         resendVerify);
router.post('/login',                 login);
router.post('/forgot-password',       forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me',                     protect, getMe);
router.put('/password',               protect, changePassword);

module.exports = router;
