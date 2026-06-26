const router = require('express').Router();
const { protect }   = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getUsers, createUser, updateUser, toggleUser } = require('../controllers/user.controller');

router.use(protect, authorize('admin'));
router.get('/',            getUsers);
router.post('/',           createUser);
router.put('/:id',         updateUser);
router.put('/:id/toggle',  toggleUser);

module.exports = router;
