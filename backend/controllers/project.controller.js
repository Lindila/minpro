const Project = require('../models/Project');
const { log: logActivity } = require('./activity.controller');

// Filtre selon le rôle de l'utilisateur connecté
const buildFilter = (user) => {
  if (user.role === 'admin') return {};
  if (user.role === 'dir')  return { institute: user.institute?._id };
  return { $or: [{ chefProjet: user._id }, { chercheurs: user._id }] };
};

const POPULATE_LIGHT = [
  { path: 'institute',  select: 'sigle nom code' },
  { path: 'chefProjet', select: 'prenom nom email' },
  { path: 'chercheurs', select: 'prenom nom' },
];

const POPULATE_FULL = [
  ...POPULATE_LIGHT,
  { path: 'milestones.responsable', select: 'prenom nom' },
  { path: 'depenses.saisiePar',     select: 'prenom nom' },
  { path: 'documents.uploadePar',   select: 'prenom nom' },
  { path: 'documents.valideePar',   select: 'prenom nom' },
  { path: 'creePar',                select: 'prenom nom' },
];

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const filter = buildFilter(req.user);
    const { statut, institute, search } = req.query;
    if (statut)    filter.statut = statut;
    if (institute) filter.institute = institute;
    if (search)    filter.intitule = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter)
      .populate(POPULATE_LIGHT)
      .sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(POPULATE_FULL);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const count = await Project.countDocuments();
    const code = `P${String(count + 1).padStart(3, '0')}`;
    const project = await Project.create({ ...req.body, code, creePar: req.user._id });
    await project.populate(POPULATE_LIGHT);
    logActivity('project_created', req.user._id, project._id, `Projet "${project.intitule}" créé`);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate(POPULATE_LIGHT);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── JALONS ──────────────────────────────────────────────

// POST /api/projects/:id/milestones
const addMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    project.milestones.push({ ...req.body, statut: 'pending' });
    await project.save();
    await project.populate('milestones.responsable', 'prenom nom');
    logActivity('milestone_added', req.user._id, project._id, `Jalon "${req.body.nom}" ajouté`);
    res.status(201).json({ success: true, data: project.milestones });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id/milestones/:msId
const updateMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    const ms = project.milestones.id(req.params.msId);
    if (!ms) return res.status(404).json({ success: false, message: 'Jalon introuvable' });
    Object.assign(ms, req.body);
    await project.save();
    res.json({ success: true, data: project.milestones });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/projects/:id/milestones/:msId
const deleteMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    const ms = project.milestones.id(req.params.msId);
    if (!ms) return res.status(404).json({ success: false, message: 'Jalon introuvable' });
    ms.deleteOne();
    await project.save();
    res.json({ success: true, data: project.milestones });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DÉPENSES ────────────────────────────────────────────

// POST /api/projects/:id/depenses
const addExpense = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    project.depenses.push({ ...req.body, saisiePar: req.user._id });
    project.budgetDepense += Number(req.body.montant);
    await project.save();
    logActivity('expense_added', req.user._id, project._id, `Dépense de ${req.body.montant} FCFA ajoutée`);
    res.status(201).json({ success: true, data: project.depenses, budgetDepense: project.budgetDepense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/projects/:id/depenses/:expId
const deleteExpense = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    const exp = project.depenses.id(req.params.expId);
    if (!exp) return res.status(404).json({ success: false, message: 'Dépense introuvable' });
    project.budgetDepense = Math.max(0, project.budgetDepense - exp.montant);
    exp.deleteOne();
    await project.save();
    res.json({ success: true, data: project.depenses, budgetDepense: project.budgetDepense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DOCUMENTS ───────────────────────────────────────────

// POST /api/projects/:id/documents
const addDocument = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    project.documents.push({ ...req.body, uploadePar: req.user._id, statut: 'pending' });
    await project.save();
    await project.populate('documents.uploadePar', 'prenom nom');
    logActivity('document_uploaded', req.user._id, project._id, `Document "${req.body.nom}" uploadé`);
    res.status(201).json({ success: true, data: project.documents });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id/documents/:docId/validate
const validateDocument = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    const doc = project.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document introuvable' });
    doc.statut = 'valid';
    doc.valideePar = req.user._id;
    doc.dateValidation = new Date();
    await project.save();
    logActivity('document_validated', req.user._id, project._id, `Document "${doc.nom}" validé`);
    res.json({ success: true, data: project.documents });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/projects/:id/documents/:docId/reject
const rejectDocument = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    const doc = project.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ success: false, message: 'Document introuvable' });
    doc.statut = 'rejete';
    doc.notes = req.body.notes || '';
    await project.save();
    res.json({ success: true, data: project.documents });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── ALERTES ─────────────────────────────────────────────

// GET /api/projects/alerts
const getAlerts = async (req, res) => {
  try {
    const filter = { ...buildFilter(req.user), statut: 'En cours' };
    const projects = await Project.find(filter)
      .select('intitule code milestones budgetInitial budgetDepense')
      .populate('institute', 'sigle');
    const today = new Date();
    const alerts = [];

    projects.forEach((p) => {
      p.milestones.forEach((m) => {
        if (m.statut === 'done') return;
        const daysLeft = Math.round((new Date(m.datePrevue) - today) / 86400000);
        if (daysLeft < 0) {
          alerts.push({ type: 'late_milestone', severity: 'danger', daysLeft: Math.abs(daysLeft), projectId: p._id, projectCode: p.code, projectIntitule: p.intitule, milestoneNom: m.nom, datePrevue: m.datePrevue });
        } else if (daysLeft <= 7) {
          alerts.push({ type: 'milestone_soon', severity: 'warning', daysLeft, projectId: p._id, projectCode: p.code, projectIntitule: p.intitule, milestoneNom: m.nom, datePrevue: m.datePrevue });
        }
      });
      if (p.budgetInitial > 0) {
        const pct = Math.round((p.budgetDepense / p.budgetInitial) * 100);
        if (pct >= 90) {
          alerts.push({ type: 'budget_critical', severity: pct >= 100 ? 'danger' : 'warning', pct, projectId: p._id, projectCode: p.code, projectIntitule: p.intitule });
        }
      }
    });

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/projects/stats
const getStats = async (req, res) => {
  try {
    const filter = buildFilter(req.user);
    const [total, enCours, enPrep, clotures, all] = await Promise.all([
      Project.countDocuments(filter),
      Project.countDocuments({ ...filter, statut: 'En cours' }),
      Project.countDocuments({ ...filter, statut: 'En préparation' }),
      Project.countDocuments({ ...filter, statut: { $in: ['Clôturé', 'Archivé'] } }),
      Project.find(filter)
        .select('statut milestones documents budgetInitial budgetDepense')
        .populate('institute', 'sigle'),
    ]);

    const today = new Date();
    let jalonsEnRetard = 0;
    let rapportsEnAttente = 0;
    const byInstitute = {};

    all.forEach((p) => {
      p.milestones.forEach((m) => {
        if (m.statut !== 'done' && new Date(m.datePrevue) < today) jalonsEnRetard++;
      });
      p.documents.forEach((d) => { if (d.statut === 'pending') rapportsEnAttente++; });
      const sigle = p.institute?.sigle || 'Autre';
      byInstitute[sigle] = (byInstitute[sigle] || 0) + 1;
    });

    res.json({ success: true, data: { total, enCours, enPrep, clotures, jalonsEnRetard, rapportsEnAttente, byInstitute } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProjects, getProject, createProject, updateProject,
  addMilestone, updateMilestone, deleteMilestone,
  addExpense, deleteExpense,
  addDocument, validateDocument, rejectDocument,
  getAlerts, getStats,
};
