const router = require('express').Router();
const { protect }   = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { getResearchers, createResearcher, updateResearcher } = require('../controllers/researcher.controller');

router.use(protect);
router.get('/',     getResearchers);
router.post('/',    authorize('admin', 'chef', 'dir'), createResearcher);
router.put('/:id',  authorize('admin', 'chef', 'dir'), updateResearcher);

module.exports = router;
