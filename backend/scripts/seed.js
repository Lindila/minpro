/**
 * SIGPRO-MINRESI — Script de peuplement de la base de données
 * Usage : cd backend && node scripts/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose   = require('mongoose');
const Institute  = require('../models/Institute');
const User       = require('../models/User');
const Project    = require('../models/Project');
const Researcher = require('../models/Researcher');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sigpro_minresi';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connecté');

  // Nettoyage
  await Promise.all([
    Institute.deleteMany(),
    User.deleteMany(),
    Project.deleteMany(),
    Researcher.deleteMany(),
  ]);
  console.log('🗑️  Données existantes supprimées');

  // ── Instituts ────────────────────────────────────────────────
  const institutes = await Institute.insertMany([
    { code: 'IRAD',      sigle: 'IRAD',      nom: 'Institut de Recherche Agricole pour le Développement',    domaine: 'Agriculture'    },
    { code: 'IMPM',      sigle: 'IMPM',      nom: 'Institut de Recherches Médicales et Plantes Médicinales', domaine: 'Santé'          },
    { code: 'IRGM',      sigle: 'IRGM',      nom: 'Institut de Recherches Géologiques et Minières',          domaine: 'Géologie'       },
    { code: 'INC',       sigle: 'INC',       nom: 'Institut National de Cartographie',                       domaine: 'Cartographie'   },
    { code: 'ANRP',      sigle: 'ANRP',      nom: 'Agence Nationale de Radioprotection',                     domaine: 'Radioprotection'},
    { code: 'MIPROMALO', sigle: 'MIPROMALO', nom: 'Mission de Promotion des Matériaux Locaux',               domaine: 'Matériaux'      },
    { code: 'CNE',       sigle: 'CNE',       nom: "Centre National d'Éducation",                             domaine: 'Éducation'      },
    { code: 'CNDT',      sigle: 'CNDT',      nom: 'Comité National de Développement des Technologies',       domaine: 'Technologie'    },
  ]);
  const I = Object.fromEntries(institutes.map(i => [i.sigle, i._id]));
  console.log(`👔 ${institutes.length} instituts créés`);

  // ── Utilisateurs ─────────────────────────────────────────────
  const users = await User.create([
    { prenom: 'Marie-Claire', nom: 'NGUYEN',  email: 'admin@minresi.cm',      password: 'admin123', role: 'admin', institute: null       },
    { prenom: 'Paul',         nom: 'MBARGA',  email: 'chef@minresi.cm',       password: 'chef123',  role: 'chef',  institute: I.IRAD     },
    { prenom: 'Cécile',       nom: 'ATEBA',   email: 'dir@minresi.cm',        password: 'dir123',   role: 'dir',   institute: I.IMPM     },
    { prenom: 'Jean-Baptiste',nom: 'TANDA',   email: 'chercheur@minresi.cm',  password: 'ch123',    role: 'ch',    institute: I.IRAD     },
    { prenom: 'Brigitte',     nom: 'ESSONO',  email: 'essono@minresi.cm',     password: 'ess123',   role: 'chef',  institute: I.CNE      },
    { prenom: 'Samuel',       nom: 'FOUDA',   email: 'fouda@minresi.cm',      password: 'foud123',  role: 'ch',    institute: I.ANRP     },
  ]);
  const U = Object.fromEntries(users.map(u => [u.email, u._id]));
  console.log(`👤 ${users.length} utilisateurs créés`);

  // ── Chercheurs ───────────────────────────────────────────────
  const researchers = await Researcher.insertMany([
    { prenom: 'Jean-Baptiste', nom: 'TANDA',    specialite: 'Génétique végétale',          grade: 'Maître de recherche',    institute: I.IRAD,      email: 'tanda@irad.cm'         },
    { prenom: 'Samuel',        nom: 'FOUDA',    specialite: 'Physique nucléaire',           grade: 'Chercheur',              institute: I.ANRP,      email: 'fouda@anrp.cm'         },
    { prenom: 'Bernadette',    nom: 'NGONO',    specialite: 'Biochimie médicale',           grade: 'Attaché de recherche',   institute: I.IMPM,      email: 'ngono@impm.cm'         },
    { prenom: 'Christian',     nom: 'BIYA',     specialite: 'Géologie structurale',         grade: 'Maître de recherche',    institute: I.IRGM,      email: 'biya@irgm.cm'          },
    { prenom: 'Élise',         nom: 'KAMGA',    specialite: 'Géomatique et SIG',            grade: 'Chercheur',              institute: I.INC,       email: 'kamga@inc.cm'          },
    { prenom: 'Martin',        nom: 'ABOSSOLO', specialite: 'Science des matériaux',        grade: 'Directeur de recherche', institute: I.MIPROMALO, email: 'abossolo@mipromalo.cm' },
    { prenom: 'Florence',      nom: 'NKOA',     specialite: 'Pédagogie des sciences',       grade: 'Attaché de recherche',   institute: I.CNE,       email: 'nkoa@cne.cm'           },
    { prenom: 'Rodrigue',      nom: 'MESSI',    specialite: 'Informatique appliquée',       grade: 'Chercheur',              institute: I.CNDT,      email: 'messi@cndt.cm'         },
    { prenom: 'Aurélie',       nom: 'EYEBE',    specialite: 'Agronomie tropicale',          grade: 'Maître de recherche',    institute: I.IRAD,      email: 'eyebe@irad.cm'         },
    { prenom: 'Pierre',        nom: 'ZANG',     specialite: 'Virologie et épidémiologie',   grade: 'Directeur de recherche', institute: I.IMPM,      email: 'zang@impm.cm'          },
  ]);
  console.log(`🔬 ${researchers.length} chercheurs créés`);

  // Helpers dates
  const ago   = n => new Date(Date.now() - n * 86400000);
  const ahead = n => new Date(Date.now() + n * 86400000);

  // ── Projets ──────────────────────────────────────────────────
  const projectsData = [
    {
      code: 'P001', intitule: 'Amélioration variétale du maïs au Cameroun',
      description: "Sélection et diffusion de variétés de maïs adaptées aux conditions pédoclimatiques camerounaises pour améliorer les rendements nationaux.",
      domaine: 'Agriculture', institute: I.IRAD, chefProjet: U['chef@minresi.cm'],
      chercheurs: [U['chercheur@minresi.cm']], statut: 'En cours',
      dateDebut: ago(90), dateFin: ahead(45),
      bailleurs: [{ source: 'AFD', montant: 15000000 }],
      budgetInitial: 15000000, budgetDepense: 11200000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Sélection des lignées parentales', datePrevue: ago(60), dateReelle: ago(55), statut: 'done', responsable: U['chercheur@minresi.cm'] },
        { nom: 'Tests au champ – Saison A',        datePrevue: ago(10), statut: 'pending',    responsable: U['chercheur@minresi.cm'] },
        { nom: 'Rédaction rapport intermédiaire',   datePrevue: ahead(20), statut: 'pending', responsable: U['chef@minresi.cm'] },
        { nom: 'Rapport final et restitution AFD',  datePrevue: ahead(45), statut: 'pending', responsable: U['chef@minresi.cm'] },
      ],
      depenses: [
        { categorie: 'Personnel',  montant: 4500000, date: ago(80), description: 'Salaires chercheurs Q1',              saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Équipement', montant: 3200000, date: ago(60), description: 'Semences et matériel laboratoire',    saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Transport',  montant: 1800000, date: ago(30), description: 'Missions terrain Ouest et Centre',    saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Divers',     montant: 1700000, date: ago(15), description: 'Frais généraux',                      saisiePar: U['chef@minresi.cm'] },
      ],
      documents: [
        { nom: 'Rapport_Avancement_T1.pdf',        type: 'rapport',   statut: 'valid',   uploadePar: U['chercheur@minresi.cm'] },
        { nom: 'Protocole_Tests_Champ.docx',        type: 'protocole', statut: 'valid',   uploadePar: U['chercheur@minresi.cm'] },
        { nom: 'Rapport_Intermédiaire_Draft.pdf',   type: 'rapport',   statut: 'pending', uploadePar: U['chercheur@minresi.cm'] },
      ],
    },
    {
      code: 'P002', intitule: 'Phytothérapie et plantes médicinales – Région Centre',
      description: "Inventaire et évaluation des propriétés thérapeutiques de 50 plantes médicinales de la région Centre du Cameroun.",
      domaine: 'Santé', institute: I.IMPM, chefProjet: U['dir@minresi.cm'],
      chercheurs: [U['fouda@minresi.cm']], statut: 'En cours',
      dateDebut: ago(200), dateFin: ahead(90),
      bailleurs: [{ source: 'IAEA', montant: 8500000 }, { source: 'Fonds propres', montant: 2000000 }],
      budgetInitial: 10500000, budgetDepense: 7200000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Inventaire botanique terrain',     datePrevue: ago(120), dateReelle: ago(115), statut: 'done', responsable: U['dir@minresi.cm']   },
        { nom: 'Extraction et analyses laboratoire',datePrevue: ago(30), dateReelle: ago(25),  statut: 'done', responsable: U['fouda@minresi.cm'] },
        { nom: 'Tests toxicologiques',             datePrevue: ahead(30),  statut: 'pending', responsable: U['dir@minresi.cm'] },
        { nom: 'Publication des résultats',        datePrevue: ahead(90),  statut: 'pending', responsable: U['dir@minresi.cm'] },
      ],
      depenses: [
        { categorie: 'Personnel', montant: 3000000, date: ago(100), description: 'Salaires équipe de recherche', saisiePar: U['dir@minresi.cm']   },
        { categorie: 'Réactifs',  montant: 2500000, date: ago(80),  description: 'Réactifs laboratoire IMPM',   saisiePar: U['dir@minresi.cm']   },
        { categorie: 'Transport', montant: 1700000, date: ago(50),  description: 'Collecte terrain région Centre',saisiePar: U['fouda@minresi.cm'] },
      ],
      documents: [
        { nom: 'Inventaire_Plantes_Médicinales.xlsx', type: 'rapport', statut: 'valid', uploadePar: U['dir@minresi.cm']   },
        { nom: 'Rapport_Analyses_Labo_T2.pdf',         type: 'rapport', statut: 'valid', uploadePar: U['fouda@minresi.cm'] },
      ],
    },
    {
      code: 'P003', intitule: 'Cartographie des ressources minérales du Nord Cameroun',
      description: "Établissement d'une carte géologique détaillée des régions minières de l'Adamaoua et du Nord.",
      domaine: 'Géologie', institute: I.IRGM, chefProjet: U['chef@minresi.cm'],
      chercheurs: [], statut: 'En préparation',
      dateDebut: ahead(10), dateFin: ahead(365),
      bailleurs: [{ source: 'BIP', montant: 25000000 }],
      budgetInitial: 25000000, budgetDepense: 800000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Kick-off et constitution équipes', datePrevue: ahead(15), statut: 'pending', responsable: U['chef@minresi.cm'] },
        { nom: 'Première mission terrain',          datePrevue: ahead(60), statut: 'pending', responsable: U['chef@minresi.cm'] },
      ],
      depenses: [{ categorie: 'Divers', montant: 800000, date: ago(5), description: 'Frais de lancement', saisiePar: U['chef@minresi.cm'] }],
      documents: [],
    },
    {
      code: 'P004', intitule: 'SIG pour la gestion des terres agricoles',
      description: "Développement d'un SIG pour l'optimisation de l'utilisation des terres agricoles camerounaises.",
      domaine: 'Cartographie', institute: I.INC, chefProjet: U['chef@minresi.cm'],
      chercheurs: [U['chercheur@minresi.cm']], statut: 'Suspendu',
      dateDebut: ago(300), dateFin: ahead(200),
      bailleurs: [{ source: 'IRD', montant: 12000000 }],
      budgetInitial: 12000000, budgetDepense: 9800000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Conception du système SIG',           datePrevue: ago(200), dateReelle: ago(185), statut: 'done',    responsable: U['chercheur@minresi.cm'] },
        { nom: 'Collecte données terrain (phases 1+2)',datePrevue: ago(80),  statut: 'pending',                       responsable: U['chercheur@minresi.cm'] },
        { nom: 'Déploiement pilote',                   datePrevue: ahead(60),statut: 'pending',                       responsable: U['chef@minresi.cm']      },
      ],
      depenses: [
        { categorie: 'Logiciels',  montant: 3500000, date: ago(200), description: 'Licences ArcGIS',         saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Personnel',  montant: 4800000, date: ago(150), description: 'Salaires équipe SIG',     saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Équipement', montant: 1500000, date: ago(100), description: 'Matériel GPS terrain',    saisiePar: U['chef@minresi.cm'] },
      ],
      documents: [{ nom: 'CDC_SIG_Agriculture.pdf', type: 'rapport', statut: 'valid', uploadePar: U['chef@minresi.cm'] }],
    },
    {
      code: 'P005', intitule: 'Monitoring des rayonnements ionisants au Cameroun',
      description: "Mise en place d'un réseau national de surveillance des rayonnements ionisants.",
      domaine: 'Radioprotection', institute: I.ANRP, chefProjet: U['essono@minresi.cm'],
      chercheurs: [U['fouda@minresi.cm']], statut: 'Clôturé',
      dateDebut: ago(800), dateFin: ago(30),
      bailleurs: [{ source: 'AIEA', montant: 18000000 }],
      budgetInitial: 18000000, budgetDepense: 17200000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Installation réseau capteurs', datePrevue: ago(300), dateReelle: ago(285), statut: 'done', responsable: U['fouda@minresi.cm']   },
        { nom: 'Formation des opérateurs',     datePrevue: ago(150), dateReelle: ago(145), statut: 'done', responsable: U['essono@minresi.cm'] },
        { nom: 'Rapport final et restitution', datePrevue: ago(30),  dateReelle: ago(28),  statut: 'done', responsable: U['essono@minresi.cm'] },
      ],
      depenses: [
        { categorie: 'Équipement', montant: 8500000, date: ago(350), description: 'Capteurs (20 unités)',      saisiePar: U['essono@minresi.cm'] },
        { categorie: 'Formation',  montant: 2500000, date: ago(150), description: 'Formation 20 techniciens', saisiePar: U['essono@minresi.cm'] },
        { categorie: 'Personnel',  montant: 6200000, date: ago(300), description: 'Salaires 2 ans',           saisiePar: U['essono@minresi.cm'] },
      ],
      documents: [
        { nom: 'Rapport_Final_Monitoring_2024.pdf', type: 'rapport', statut: 'valid', uploadePar: U['essono@minresi.cm'] },
        { nom: 'Manuel_Opérateurs_Terrain.pdf',      type: 'rapport', statut: 'valid', uploadePar: U['fouda@minresi.cm']  },
      ],
    },
    {
      code: 'P006', intitule: 'Briques en terre comprimée haute résistance',
      description: "Développement d'une filière de production de briques en terre comprimée adaptées aux zones rurales camerounaises.",
      domaine: 'Matériaux', institute: I.MIPROMALO, chefProjet: U['essono@minresi.cm'],
      chercheurs: [U['chercheur@minresi.cm'], U['fouda@minresi.cm']], statut: 'En cours',
      dateDebut: ago(60), dateFin: ahead(120),
      bailleurs: [{ source: 'CNRS', montant: 9500000 }, { source: 'BIP', montant: 5000000 }],
      budgetInitial: 14500000, budgetDepense: 13800000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Formulation mélanges argile-stabilisant', datePrevue: ago(90),  dateReelle: ago(88), statut: 'done',    responsable: U['chercheur@minresi.cm'] },
        { nom: 'Tests résistance mécanique',              datePrevue: ago(20),  statut: 'pending',                      responsable: U['chercheur@minresi.cm'] },
        { nom: 'Prototype unité de fabrication',          datePrevue: ahead(60),statut: 'pending',                      responsable: U['essono@minresi.cm']    },
      ],
      depenses: [
        { categorie: 'Matières premières', montant: 4500000, date: ago(120), description: 'Argile et stabilisants',    saisiePar: U['essono@minresi.cm'] },
        { categorie: 'Équipement',         montant: 5200000, date: ago(90),  description: 'Presse BTC et équipements', saisiePar: U['essono@minresi.cm'] },
        { categorie: 'Personnel',          montant: 4100000, date: ago(60),  description: 'Salaires équipe technique',  saisiePar: U['essono@minresi.cm'] },
      ],
      documents: [
        { nom: 'Formulations_BTC_v2.xlsx',        type: 'rapport', statut: 'valid',   uploadePar: U['chercheur@minresi.cm'] },
        { nom: 'Rapport_Tests_Résistance.pdf',     type: 'rapport', statut: 'pending', uploadePar: U['chercheur@minresi.cm'] },
      ],
    },
    {
      code: 'P007', intitule: 'Réforme curriculum sciences lycées bilingues',
      description: "Révision des programmes de sciences des lycées bilingues pour intégrer les compétences du 21e siècle.",
      domaine: 'Éducation', institute: I.CNE, chefProjet: U['essono@minresi.cm'],
      chercheurs: [], statut: 'En cours',
      dateDebut: ago(45), dateFin: ahead(200),
      bailleurs: [{ source: 'Fonds propres', montant: 7000000 }],
      budgetInitial: 7000000, budgetDepense: 2100000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Analyse des curricula existants',    datePrevue: ago(30),   dateReelle: ago(28), statut: 'done',    responsable: U['essono@minresi.cm'] },
        { nom: 'Ateliers avec enseignants (4 régions)',datePrevue: ahead(30),  statut: 'pending',                    responsable: U['essono@minresi.cm'] },
        { nom: 'Rédaction nouveaux programmes',      datePrevue: ahead(120), statut: 'pending',                    responsable: U['essono@minresi.cm'] },
      ],
      depenses: [
        { categorie: 'Divers', montant: 1500000, date: ago(60), description: 'Experts curriculum internationaux', saisiePar: U['essono@minresi.cm'] },
        { categorie: 'Divers', montant: 600000,  date: ago(30), description: 'Séminaires enseignants',            saisiePar: U['essono@minresi.cm'] },
      ],
      documents: [{ nom: 'Analyse_Curricula_Existants.pdf', type: 'rapport', statut: 'valid', uploadePar: U['essono@minresi.cm'] }],
    },
    {
      code: 'P008', intitule: "Plateforme numérique d'accès aux innovations camerounaises",
      description: "Développement d'une plateforme web de valorisation des innovations camerounaises.",
      domaine: 'Technologie', institute: I.CNDT, chefProjet: U['chef@minresi.cm'],
      chercheurs: [U['chercheur@minresi.cm']], statut: 'En cours',
      dateDebut: ago(45), dateFin: ahead(270),
      bailleurs: [{ source: 'BIP', montant: 25000000 }],
      budgetInitial: 25000000, budgetDepense: 3200000, creePar: U['admin@minresi.cm'],
      milestones: [
        { nom: 'Spécifications techniques validées', datePrevue: ago(15),  dateReelle: ago(12), statut: 'done',    responsable: U['chef@minresi.cm']      },
        { nom: 'Maquettes UI/UX finalisées',         datePrevue: ahead(20), statut: 'pending',                     responsable: U['chercheur@minresi.cm'] },
        { nom: 'Développement MVP',                  datePrevue: ahead(90), statut: 'pending',                     responsable: U['chercheur@minresi.cm'] },
        { nom: 'Déploiement et tests utilisateurs',  datePrevue: ahead(200),statut: 'pending',                     responsable: U['chef@minresi.cm']      },
      ],
      depenses: [
        { categorie: 'Personnel',  montant: 2000000, date: ago(40), description: 'Développeurs frontend et backend', saisiePar: U['chef@minresi.cm'] },
        { categorie: 'Équipement', montant: 1200000, date: ago(20), description: 'Serveurs et hébergement local',     saisiePar: U['chef@minresi.cm'] },
      ],
      documents: [{ nom: 'CDC_Plateforme_Innovations.pdf', type: 'rapport', statut: 'valid', uploadePar: U['chef@minresi.cm'] }],
    },
  ];

  const projects = await Project.insertMany(projectsData);
  console.log(`📁 ${projects.length} projets créés`);

  console.log(`
✅ Base de données peuplée avec succès !

📋 Comptes de connexion :
┌─────────────────────────────────────────────────────────┐
│ Rôle             │ Email                   │ Mot de passe│
├─────────────────────────────────────────────────────────┤
│ Admin MINRESI    │ admin@minresi.cm        │ admin123    │
│ Chef de projet   │ chef@minresi.cm         │ chef123     │
│ Directeur Inst.  │ dir@minresi.cm          │ dir123      │
│ Chercheur        │ chercheur@minresi.cm    │ ch123       │
└─────────────────────────────────────────────────────────┘
`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => { console.error('❌ Erreur seed :', err); process.exit(1); });
