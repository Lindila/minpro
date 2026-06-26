const router = require('express').Router();
const { protect }   = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const ctrl          = require('../controllers/project.controller');

router.use(protect);

// Stats & alerts — avant /:id pour éviter les conflits
router.get('/stats',  ctrl.getStats);
router.get('/alerts', ctrl.getAlerts);

// CRUD projets
router.get('/',    ctrl.getProjects);
router.post('/',   authorize('admin', 'chef'), ctrl.createProject);
router.get('/:id', ctrl.getProject);
router.put('/:id', authorize('admin', 'chef', 'dir'), ctrl.updateProject);

// Jalons
router.post('/:id/milestones',              authorize('admin', 'chef'), ctrl.addMilestone);
router.put('/:id/milestones/:msId',         authorize('admin', 'chef'), ctrl.updateMilestone);
router.delete('/:id/milestones/:msId',      authorize('admin', 'chef'), ctrl.deleteMilestone);

// Dépenses
router.post('/:id/depenses',                authorize('admin', 'chef'), ctrl.addExpense);
router.delete('/:id/depenses/:expId',       authorize('admin', 'chef'), ctrl.deleteExpense);

// Documents
router.post('/:id/documents',               ctrl.addDocument);
router.put('/:id/documents/:docId/validate',authorize('admin', 'chef', 'dir'), ctrl.validateDocument);
router.put('/:id/documents/:docId/reject',  authorize('admin', 'chef', 'dir'), ctrl.rejectDocument);

module.exports = router;
