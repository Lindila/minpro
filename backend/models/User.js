const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  prenom:    { type: String, required: true, trim: true },
  nom:       { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 4, select: false },
  role:      { type: String, enum: ['admin', 'chef', 'dir', 'ch'], default: 'ch', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', default: null },
  actif:     { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparaison mot de passe
UserSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Supprimer le mot de passe du JSON retourné
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
