const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { getActivities } = require('../controllers/activity.controller');

router.get('/', protect, getActivities);

module.exports = router;
