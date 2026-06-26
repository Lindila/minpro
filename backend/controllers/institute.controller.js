const Institute = require('../models/Institute');

// GET /api/institutes
const getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find({ actif: true })
      .populate('directeur', 'prenom nom')
      .sort({ sigle: 1 });
    res.json({ success: true, data: institutes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/institutes
const createInstitute = async (req, res) => {
  try {
    const institute = await Institute.create(req.body);
    res.status(201).json({ success: true, data: institute });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Code déjà utilisé' });
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getInstitutes, createInstitute };
