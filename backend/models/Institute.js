const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  code:     { type: String, required: true, unique: true, uppercase: true },
  sigle:    { type: String, required: true, uppercase: true },
  nom:      { type: String, required: true },
  domaine:  { type: String, required: true },
  directeur:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  adresse:  { type: String },
  telephone:{ type: String },
  email:    { type: String },
  actif:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Institute', InstituteSchema);
