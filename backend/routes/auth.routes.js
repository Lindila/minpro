const router = require('express').Router();
const { register, login, getMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);
router.put('/password',  protect, changePassword);

module.exports = router;
