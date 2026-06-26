const mongoose = require('mongoose');

// --- Sous-schémas ---

const MilestoneSchema = new mongoose.Schema({
  nom:         { type: String, required: true },
  datePrevue:  { type: Date, required: true },
  dateReelle:  { type: Date, default: null },
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  statut:      { type: String, enum: ['pending', 'done'], default: 'pending' },
  notes:       { type: String },
}, { timestamps: true });

const ExpenseSchema = new mongoose.Schema({
  categorie:   {
    type: String,
    enum: ['Personnel', 'Équipement', 'Transport', 'Réactifs', 'Formation', 'Logiciels', 'Matières premières', 'Divers'],
    required: true,
  },
  montant:     { type: Number, required: true, min: 0 },
  date:        { type: Date, required: true },
  description: { type: String },
  saisiePar:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const DocumentSchema = new mongoose.Schema({
  nom:            { type: String, required: true },
  type:           { type: String, enum: ['rapport', 'protocole', 'budget', 'contrat', 'autre'], default: 'rapport' },
  statut:         { type: String, enum: ['draft', 'pending', 'valid', 'rejete'], default: 'pending' },
  uploadePar:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  valideePar:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dateValidation: { type: Date, default: null },
  notes:          { type: String },
}, { timestamps: true });

const BailleurSchema = new mongoose.Schema({
  source:          { type: String, required: true },
  montant:         { type: Number, required: true, min: 0 },
  dateEngagement:  { type: Date },
}, { _id: false });

// --- Schéma principal ---

const ProjectSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true },
  intitule:      { type: String, required: true },
  description:   { type: String },
  domaine:       {
    type: String,
    enum: ['Agriculture', 'Santé', 'Géologie', 'Cartographie', 'Radioprotection', 'Matériaux', 'Éducation', 'Technologie', 'Autre'],
    required: true,
  },
  statut: {
    type: String,
    enum: ['En préparation', 'En cours', 'Suspendu', 'Clôturé', 'Archivé'],
    default: 'En préparation',
  },
  institute:     { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  chefProjet:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chercheurs:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dateDebut:     { type: Date, required: true },
  dateFin:       { type: Date, required: true },
  bailleurs:     [BailleurSchema],
  budgetInitial: { type: Number, required: true, min: 0, default: 0 },
  budgetDepense: { type: Number, default: 0, min: 0 },
  milestones:    [MilestoneSchema],
  depenses:      [ExpenseSchema],
  documents:     [DocumentSchema],
  creePar:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtuals
ProjectSchema.virtual('budgetRestant').get(function () {
  return this.budgetInitial - this.budgetDepense;
});
ProjectSchema.virtual('tauxConsommation').get(function () {
  if (!this.budgetInitial) return 0;
  return Math.min(100, Math.round((this.budgetDepense / this.budgetInitial) * 100));
});

module.exports = mongoose.model('Project', ProjectSchema);
