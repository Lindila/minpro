const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { prenom, nom, email, password, role, institute } = req.body;

    if (!prenom || !nom || !email || !password)
      return res.status(400).json({ success: false, message: 'Tous les champs obligatoires sont requis' });

    if (password.length < 4)
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 4 caractères' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });

    const user = await User.create({
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'ch',
      institute: institute || null,
    });

    const token = generateToken(user._id);
    const populated = await User.findById(user._id).populate('institute', 'sigle nom code');

    res.status(201).json({ success: true, token, user: populated });
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('institute', 'sigle nom code');

    if (!user || !user.actif)
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/auth/me
const getMe = (req, res) => res.json({ success: true, user: req.user });

// PUT /api/auth/password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(oldPassword)))
      return res.status(400).json({ success: false, message: 'Ancien mot de passe incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Mot de passe modifié' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getMe, changePassword };
