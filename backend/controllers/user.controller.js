const User = require('../models/User');

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { prenom: { $regex: search, $options: 'i' } },
      { nom:    { $regex: search, $options: 'i' } },
      { email:  { $regex: search, $options: 'i' } },
    ];
    const users = await User.find(filter).populate('institute', 'sigle nom').sort({ nom: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await user.populate('institute', 'sigle nom');
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      .populate('institute', 'sigle nom');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id/toggle
const toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    user.actif = !user.actif;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUsers, createUser, updateUser, toggleUser };
