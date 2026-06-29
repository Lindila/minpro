const mongoose = require('mongoose');

const InnovationSchema = new mongoose.Schema({
  nom:         { type: String, required: true },
  description: { type: String, required: true },
  domaine:     { type: String, required: true },
  image:       { type: String, default: '' },
  institute:   { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', default: null },
  auteur:      { type: String },
  statut:      { type: String, enum: ['publie', 'brouillon'], default: 'publie' },
  actif:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Innovation', InnovationSchema);
