const router = require('express').Router();
const { protect }   = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getInstitutes, createInstitute } = require('../controllers/institute.controller');

router.get('/',  getInstitutes);
router.post('/', protect, authorize('admin'), createInstitute);

module.exports = router;
