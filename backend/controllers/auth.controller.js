const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { log: logActivity } = require('./activity.controller');
const { sendEmail, verifyEmailTemplate, resetPasswordTemplate } = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const appUrl = () => process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

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
      isVerified: false,
    });

    const verifyToken = user.generateVerifyToken();
    await user.save({ validateBeforeSave: false });

    const link = `${appUrl()}/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'SIGPRO-MINRESI — Vérifiez votre adresse email',
      html: verifyEmailTemplate(`${user.prenom} ${user.nom}`, link),
    });

    logActivity('user_registered', user._id, null, `${user.prenom} ${user.nom} s'est inscrit`);
    res.status(201).json({
      success: true,
      needsVerification: true,
      message: 'Compte créé ! Vérifiez votre email pour activer votre compte.',
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// GET /api/auth/verify/:token
const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Lien invalide ou expiré' });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    logActivity('user_registered', user._id, null, `${user.prenom} ${user.nom} a vérifié son email`);
    res.json({ success: true, message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/auth/resend-verify
const resendVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user)
      return res.status(404).json({ success: false, message: 'Aucun compte avec cet email' });
    if (user.isVerified)
      return res.status(400).json({ success: false, message: 'Ce compte est déjà vérifié' });

    const verifyToken = user.generateVerifyToken();
    await user.save({ validateBeforeSave: false });

    const link = `${appUrl()}/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'SIGPRO-MINRESI — Vérifiez votre adresse email',
      html: verifyEmailTemplate(`${user.prenom} ${user.nom}`, link),
    });

    res.json({ success: true, message: 'Email de vérification renvoyé.' });
  } catch (err) {
    console.error(err);
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

    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        needsVerification: true,
        message: 'Veuillez vérifier votre email avant de vous connecter.',
      });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    logActivity('user_login', user._id, null, `${user.prenom} ${user.nom} s'est connecté`);
    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user)
      return res.status(404).json({ success: false, message: 'Aucun compte avec cet email' });

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const link = `${appUrl()}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'SIGPRO-MINRESI — Réinitialisation du mot de passe',
      html: resetPasswordTemplate(`${user.prenom} ${user.nom}`, link),
    });

    res.json({ success: true, message: 'Email de réinitialisation envoyé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Lien invalide ou expiré' });

    if (!req.body.password || req.body.password.length < 4)
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 4 caractères' });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
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

module.exports = { register, verifyEmail, resendVerify, login, forgotPassword, resetPassword, getMe, changePassword };
