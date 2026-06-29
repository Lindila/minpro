const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const Innovation = require('../models/Innovation');

router.get('/', async (req, res) => {
  try {
    const filter = { actif: true, statut: 'publie' };
    const innovations = await Innovation.find(filter)
      .populate('institute', 'sigle nom')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: innovations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin', 'chef'), async (req, res) => {
  try {
    const innovation = await Innovation.create(req.body);
    await innovation.populate('institute', 'sigle nom');
    res.status(201).json({ success: true, data: innovation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin', 'chef'), async (req, res) => {
  try {
    const innovation = await Innovation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('institute', 'sigle nom');
    if (!innovation) return res.status(404).json({ success: false, message: 'Innovation introuvable' });
    res.json({ success: true, data: innovation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Innovation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Innovation supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
