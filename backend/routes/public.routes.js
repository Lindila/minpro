const router = require('express').Router();
const Project = require('../models/Project');
const Institute = require('../models/Institute');
const Researcher = require('../models/Researcher');

router.get('/landing', async (req, res) => {
  try {
    const [institutes, projects, researcherCount] = await Promise.all([
      Institute.find({ actif: true }).select('sigle nom domaine adresse telephone email').sort({ sigle: 1 }),
      Project.find().select('intitule domaine statut institute dateDebut dateFin budgetInitial budgetDepense')
        .populate('institute', 'sigle nom').sort({ createdAt: -1 }),
      Researcher.countDocuments({ actif: true }),
    ]);

    const recentProjects = projects.slice(0, 6);
    const stats = {
      projects: projects.length,
      institutes: institutes.length,
      researchers: researcherCount,
      innovations: projects.filter(p => p.statut === 'Clôturé' || p.statut === 'En cours').length,
    };

    res.json({ success: true, data: { institutes, recentProjects, stats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
