const Researcher = require('../models/Researcher');

// GET /api/researchers
const getResearchers = async (req, res) => {
  try {
    const { search, institute } = req.query;
    const filter = { actif: true };
    if (institute) filter.institute = institute;
    if (search) filter.$or = [
      { prenom: { $regex: search, $options: 'i' } },
      { nom:    { $regex: search, $options: 'i' } },
      { specialite: { $regex: search, $options: 'i' } },
    ];
    const researchers = await Researcher.find(filter)
      .populate('institute', 'sigle nom')
      .sort({ nom: 1 });
    res.json({ success: true, data: researchers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/researchers
const createResearcher = async (req, res) => {
  try {
    const r = await Researcher.create(req.body);
    await r.populate('institute', 'sigle nom');
    res.status(201).json({ success: true, data: r });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/researchers/:id
const updateResearcher = async (req, res) => {
  try {
    const r = await Researcher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('institute', 'sigle nom');
    if (!r) return res.status(404).json({ success: false, message: 'Chercheur introuvable' });
    res.json({ success: true, data: r });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getResearchers, createResearcher, updateResearcher };
