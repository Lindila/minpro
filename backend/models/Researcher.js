const mongoose = require('mongoose');

const ResearcherSchema = new mongoose.Schema({
  prenom:     { type: String, required: true },
  nom:        { type: String, required: true },
  email:      { type: String, required: true },
  telephone:  { type: String },
  grade:      { type: String, required: true },
  specialite: { type: String, required: true },
  institute:  { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  actif:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Researcher', ResearcherSchema);
