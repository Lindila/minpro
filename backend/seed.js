const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const User = require('./models/User');
const Institute = require('./models/Institute');
const Project = require('./models/Project');
const Researcher = require('./models/Researcher');
const Innovation = require('./models/Innovation');

// ══════════════════════════════════════════════════════
//  DONNÉES RÉELLES — MINRESI Cameroun
// ══════════════════════════════════════════════════════

const INSTITUTES = [
  {
    code: 'IRAD',
    sigle: 'IRAD',
    nom: "Institut de Recherche Agricole pour le Développement",
    domaine: 'Agriculture',
    adresse: 'B.P. 2123, Nkolbisson, Yaoundé',
    telephone: '+237 222 23 26 44',
    email: 'irad@irad.cm',
  },
  {
    code: 'IMPM',
    sigle: 'IMPM',
    nom: "Institut de Recherches Médicales et d'Études des Plantes Médicinales",
    domaine: 'Santé',
    adresse: 'B.P. 13033, Ngoa-Ekellé, Yaoundé',
    telephone: '+237 222 23 44 52',
    email: 'contact@impm-cm.org',
  },
  {
    code: 'INC',
    sigle: 'INC',
    nom: "Institut National de Cartographie",
    domaine: 'Cartographie',
    adresse: 'B.P. 157, Elig-Essono, Avenue Mgr Vogt, Yaoundé',
    telephone: '+237 222 22 29 21',
    email: 'info@inc-cameroon.cm',
  },
  {
    code: 'IRGM',
    sigle: 'IRGM',
    nom: "Institut de Recherches Géologiques et Minières",
    domaine: 'Géologie',
    adresse: 'B.P. 4110, Avenue Mgr Vogt, Yaoundé',
    telephone: '+237 222 22 24 30',
    email: 'irgm@irgm-cameroun.org',
  },
  {
    code: 'MIPROMALO',
    sigle: 'MIPROMALO',
    nom: "Mission de Promotion des Matériaux Locaux",
    domaine: 'Matériaux',
    adresse: 'B.P. 2396, Montée du Parc Nkol-Bikok, Yaoundé',
    telephone: '+237 222 22 94 45',
    email: 'contact@mipromalo.cm',
  },
  {
    code: 'ANRP',
    sigle: 'ANRP',
    nom: "Agence Nationale de Radioprotection",
    domaine: 'Radioprotection',
    adresse: 'B.P. 33732, Yaoundé',
    telephone: '+237 222 20 33 71',
    email: 'officialmail@anrp.cm',
  },
  {
    code: 'CNE',
    sigle: 'CNE',
    nom: "Centre National d'Éducation",
    domaine: 'Éducation',
    adresse: 'B.P. 6331, Yaoundé',
    telephone: '+237 222 24 40 12',
    email: 'contact@cne.cm',
  },
  {
    code: 'CNDT',
    sigle: 'CNDT',
    nom: "Comité National de Développement des Technologies",
    domaine: 'Technologie',
    adresse: 'B.P. 1457, Centre Administratif, Yaoundé',
    telephone: '+237 222 22 25 09',
    email: 'contact@cndtcameroun.cm',
  },
];

const USERS = [
  // ── Compte développeur (superadmin) ──
  { prenom: 'Yvana', nom: 'NOUTCHANG NONO', email: 'noutchangyvana@gmail.com', password: 'Yvana2026', role: 'dev' },

  // ── Comptes de démonstration ──
  { prenom: 'Jean-Pierre', nom: 'MBARGA',      email: 'admin@minresi.cm',      password: 'admin123',  role: 'admin' },
  { prenom: 'Noé',         nom: 'WOIN',         email: 'dir@minresi.cm',        password: 'dir123',    role: 'dir',       inst: 'IRAD' },
  { prenom: 'Paul',        nom: 'ATANGANA',     email: 'chef@minresi.cm',       password: 'chef123',   role: 'chef',      inst: 'IRAD' },
  { prenom: 'Fatima',      nom: 'OUMAROU',      email: 'comptable@minresi.cm',  password: 'compta123', role: 'comptable', inst: 'IRAD' },
  { prenom: 'Samuel',      nom: 'ESSOMBA',      email: 'chercheur@minresi.cm',  password: 'ch123',     role: 'ch',        inst: 'IMPM' },
];

const RESEARCHERS = [
  { prenom: 'Jean-Baptiste', nom: 'NKODO',       email: 'jb.nkodo@irad.cm',       telephone: '+237 699 11 22 33', grade: 'Directeur de recherche', specialite: 'Agronomie tropicale',               inst: 'IRAD' },
  { prenom: 'Hélène',        nom: 'MENGUE',      email: 'h.mengue@irad.cm',        telephone: '+237 677 44 55 66', grade: 'Maître de recherche',     specialite: 'Phytopathologie',                   inst: 'IRAD' },
  { prenom: 'Amadou',        nom: 'DJIBRIL',     email: 'a.djibril@irad.cm',       telephone: '+237 690 77 88 99', grade: 'Chercheur',              specialite: 'Agroforesterie',                    inst: 'IRAD' },
  { prenom: 'Pierre',        nom: 'ONANA',       email: 'p.onana@impm-cm.org',     telephone: '+237 655 12 34 56', grade: 'Directeur de recherche', specialite: 'Pharmacologie',                     inst: 'IMPM' },
  { prenom: 'Carine',        nom: 'FOUDA',       email: 'c.fouda@impm-cm.org',     telephone: '+237 670 23 45 67', grade: 'Maître de recherche',     specialite: 'Ethnobotanique médicale',           inst: 'IMPM' },
  { prenom: 'Adamou',        nom: 'HAMAN',       email: 'a.haman@impm-cm.org',     telephone: '+237 691 34 56 78', grade: 'Chercheur',              specialite: 'Nutrition et santé publique',       inst: 'IMPM' },
  { prenom: 'Martin',        nom: 'MBOTTA ELIMBI', email: 'm.mbotta@inc-cameroon.cm', telephone: '+237 243 39 95 61', grade: 'Directeur de recherche', specialite: 'Géodésie et cartographie',        inst: 'INC' },
  { prenom: 'Sylvie',        nom: 'NDAM',        email: 's.ndam@inc-cameroon.cm',   telephone: '+237 677 56 78 90', grade: 'Chercheur',              specialite: 'Télédétection',                     inst: 'INC' },
  { prenom: 'Joseph Victor', nom: 'HELL',        email: 'jv.hell@irgm-cameroun.org', telephone: '+237 699 45 67 89', grade: 'Directeur de recherche', specialite: 'Géologie minière',                inst: 'IRGM' },
  { prenom: 'Ismaïla',       nom: 'ABDOULAYE',   email: 'i.abdoulaye@irgm-cameroun.org', telephone: '+237 691 67 89 01', grade: 'Maître de recherche', specialite: 'Hydrologie',                    inst: 'IRGM' },
  { prenom: 'Boubakar',      nom: 'LIKIBY',      email: 'b.likiby@mipromalo.cm',   telephone: '+237 691 14 25 52', grade: 'Directeur de recherche', specialite: 'Science des matériaux',             inst: 'MIPROMALO' },
  { prenom: 'Christine',     nom: 'BENGA',       email: 'c.benga@mipromalo.cm',    telephone: '+237 677 89 01 23', grade: 'Chercheur',              specialite: 'Génie civil et matériaux locaux',   inst: 'MIPROMALO' },
  { prenom: 'Augustin',      nom: 'SIMO',        email: 'a.simo@anrp.cm',          telephone: '+237 699 78 90 12', grade: 'Directeur de recherche', specialite: 'Physique nucléaire',                inst: 'ANRP' },
  { prenom: 'Grace',         nom: 'TIAKO',       email: 'g.tiako@anrp.cm',         telephone: '+237 670 90 12 34', grade: 'Chercheur',              specialite: 'Dosimétrie et radioprotection',     inst: 'ANRP' },
  { prenom: 'Stephen',       nom: 'MFORTEH AMBE', email: 's.mforteh@cne.cm',       telephone: '+237 655 01 23 45', grade: 'Directeur de recherche', specialite: 'Sciences de l\'éducation',          inst: 'CNE' },
  { prenom: 'Blandine',      nom: 'YOTA',        email: 'b.yota@cne.cm',           telephone: '+237 677 12 34 56', grade: 'Maître de recherche',     specialite: 'Pédagogie et didactique',           inst: 'CNE' },
  { prenom: 'Patrice',       nom: 'ELE ABIAMA',  email: 'p.eleabiama@cndtcameroun.cm', telephone: '+237 699 23 45 67', grade: 'Directeur de recherche', specialite: 'Transfert technologique',       inst: 'CNDT' },
  { prenom: 'Moussa',        nom: 'DAOUDA',      email: 'm.daouda@cndtcameroun.cm', telephone: '+237 691 34 56 78', grade: 'Chercheur',              specialite: 'Innovation technologique',          inst: 'CNDT' },
];

const PROJECTS = [
  // ── IRAD ──
  {
    intitule: "Amélioration des variétés de cacao résistantes au Phytophthora",
    description: "Développer de nouvelles variétés de cacao tolérantes au champignon Phytophthora megakarya responsable de la pourriture brune des cabosses, affectant 30% de la production nationale.",
    domaine: 'Agriculture',
    statut: 'En cours',
    inst: 'IRAD',
    dateDebut: '2025-01-15',
    dateFin: '2026-12-31',
    budgetInitial: 85000000,
    budgetDepense: 32000000,
    bailleurs: [{ source: 'MINRESI', montant: 50000000 }, { source: 'AFD', montant: 35000000 }],
    milestones: [
      { nom: 'Collecte des échantillons de Phytophthora', datePrevue: '2025-04-30', statut: 'done', dateReelle: '2025-04-28' },
      { nom: 'Tests de résistance en serre', datePrevue: '2025-09-30', statut: 'done', dateReelle: '2025-10-05' },
      { nom: 'Essais en champ (phase 1)', datePrevue: '2026-03-31', statut: 'pending' },
      { nom: 'Rapport intermédiaire', datePrevue: '2026-06-30', statut: 'pending' },
      { nom: 'Sélection variétale finale', datePrevue: '2026-11-30', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Réactifs', montant: 8500000, date: '2025-03-15', description: 'Kits PCR et réactifs de laboratoire' },
      { categorie: 'Personnel', montant: 12000000, date: '2025-06-01', description: 'Primes chercheurs et techniciens' },
      { categorie: 'Équipement', montant: 6500000, date: '2025-07-20', description: 'Matériel de serre et irrigation' },
      { categorie: 'Transport', montant: 5000000, date: '2025-11-10', description: 'Missions de terrain dans les bassins cacaoyers' },
    ],
    documents: [
      { nom: 'Protocole de recherche — Cacao/Phytophthora', type: 'protocole', statut: 'valid' },
      { nom: 'Rapport de collecte des échantillons', type: 'rapport', statut: 'valid' },
      { nom: 'Budget prévisionnel 2025-2026', type: 'budget', statut: 'valid' },
    ],
  },
  {
    intitule: "Programme national de développement du riz pluvial",
    description: "Intensification de la production rizicole dans les zones de savane du Nord et de l'Adamaoua par l'introduction de variétés NERICA adaptées.",
    domaine: 'Agriculture',
    statut: 'En cours',
    inst: 'IRAD',
    dateDebut: '2025-03-01',
    dateFin: '2027-02-28',
    budgetInitial: 120000000,
    budgetDepense: 45000000,
    bailleurs: [{ source: 'BAD', montant: 75000000 }, { source: 'État du Cameroun', montant: 45000000 }],
    milestones: [
      { nom: 'Identification des sites pilotes', datePrevue: '2025-05-31', statut: 'done', dateReelle: '2025-05-20' },
      { nom: 'Distribution des semences NERICA', datePrevue: '2025-08-15', statut: 'done', dateReelle: '2025-08-18' },
      { nom: 'Suivi de la première campagne', datePrevue: '2026-01-31', statut: 'done', dateReelle: '2026-02-05' },
      { nom: 'Évaluation des rendements', datePrevue: '2026-07-31', statut: 'pending' },
      { nom: 'Rapport final et recommandations', datePrevue: '2027-01-31', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Matières premières', montant: 18000000, date: '2025-04-10', description: 'Achat de semences certifiées NERICA' },
      { categorie: 'Personnel', montant: 15000000, date: '2025-09-01', description: 'Formation des agriculteurs pilotes' },
      { categorie: 'Transport', montant: 7000000, date: '2025-12-01', description: 'Logistique terrain Nord-Cameroun' },
      { categorie: 'Équipement', montant: 5000000, date: '2026-01-15', description: 'Matériel de mesure de rendement' },
    ],
    documents: [
      { nom: 'Plan stratégique riz 2025-2027', type: 'protocole', statut: 'valid' },
      { nom: 'Contrat BAD — Financement', type: 'contrat', statut: 'valid' },
    ],
  },

  // ── IMPM ──
  {
    intitule: "Évaluation des plantes médicinales camerounaises contre le paludisme résistant",
    description: "Criblage phytochimique et tests in vitro de 50 plantes médicinales identifiées par la pharmacopée traditionnelle camerounaise pour leur activité antipaludique.",
    domaine: 'Santé',
    statut: 'En cours',
    inst: 'IMPM',
    dateDebut: '2025-06-01',
    dateFin: '2027-05-31',
    budgetInitial: 95000000,
    budgetDepense: 18000000,
    bailleurs: [{ source: 'OMS', montant: 55000000 }, { source: 'MINRESI', montant: 40000000 }],
    milestones: [
      { nom: 'Inventaire ethnobotanique', datePrevue: '2025-09-30', statut: 'done', dateReelle: '2025-09-25' },
      { nom: 'Extraction et criblage phytochimique', datePrevue: '2026-03-31', statut: 'pending' },
      { nom: 'Tests in vitro sur P. falciparum', datePrevue: '2026-09-30', statut: 'pending' },
      { nom: 'Publication des résultats', datePrevue: '2027-03-31', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Réactifs', montant: 12000000, date: '2025-08-01', description: 'Réactifs de criblage et solvants' },
      { categorie: 'Personnel', montant: 6000000, date: '2025-10-01', description: 'Enquêteurs ethnobotaniques' },
    ],
    documents: [
      { nom: 'Protocole éthique — Comité national', type: 'protocole', statut: 'valid' },
      { nom: 'Convention OMS-IMPM', type: 'contrat', statut: 'valid' },
    ],
  },

  // ── INC ──
  {
    intitule: "Cartographie numérique des zones à risques d'inondation du Cameroun",
    description: "Réalisation de cartes numériques haute résolution des zones inondables prioritaires (Extrême-Nord, Littoral, Sud-Ouest) par télédétection et SIG.",
    domaine: 'Cartographie',
    statut: 'En cours',
    inst: 'INC',
    dateDebut: '2025-02-01',
    dateFin: '2026-08-31',
    budgetInitial: 65000000,
    budgetDepense: 28000000,
    bailleurs: [{ source: 'Banque Mondiale', montant: 45000000 }, { source: 'MINRESI', montant: 20000000 }],
    milestones: [
      { nom: 'Acquisition images satellitaires Sentinel-2', datePrevue: '2025-04-15', statut: 'done', dateReelle: '2025-04-10' },
      { nom: 'Traitement et classification des images', datePrevue: '2025-08-31', statut: 'done', dateReelle: '2025-09-15' },
      { nom: 'Validation terrain Extrême-Nord', datePrevue: '2026-02-28', statut: 'done', dateReelle: '2026-03-10' },
      { nom: 'Production des cartes finales', datePrevue: '2026-06-30', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Logiciels', montant: 8000000, date: '2025-03-01', description: 'Licences ArcGIS et ENVI' },
      { categorie: 'Transport', montant: 9000000, date: '2025-10-15', description: 'Missions terrain Extrême-Nord et Littoral' },
      { categorie: 'Équipement', montant: 6000000, date: '2025-05-20', description: 'GPS différentiel et drone' },
      { categorie: 'Personnel', montant: 5000000, date: '2026-01-10', description: 'Indemnités cartographes de terrain' },
    ],
    documents: [
      { nom: 'Cahier des charges cartographique', type: 'protocole', statut: 'valid' },
      { nom: 'Rapport mission Extrême-Nord', type: 'rapport', statut: 'valid' },
    ],
  },

  // ── IRGM ──
  {
    intitule: "Inventaire géochimique des ressources en eau souterraine du bassin du Logone",
    description: "Caractérisation hydrogéochimique et évaluation de la qualité des eaux souterraines dans le bassin du Logone pour l'alimentation en eau potable.",
    domaine: 'Géologie',
    statut: 'En cours',
    inst: 'IRGM',
    dateDebut: '2024-09-01',
    dateFin: '2026-08-31',
    budgetInitial: 72000000,
    budgetDepense: 41000000,
    bailleurs: [{ source: 'IRD', montant: 40000000 }, { source: 'État du Cameroun', montant: 32000000 }],
    milestones: [
      { nom: 'Campagne de prélèvement phase 1', datePrevue: '2025-01-31', statut: 'done', dateReelle: '2025-01-28' },
      { nom: 'Analyses chimiques en laboratoire', datePrevue: '2025-06-30', statut: 'done', dateReelle: '2025-07-10' },
      { nom: 'Campagne de prélèvement phase 2', datePrevue: '2025-12-31', statut: 'done', dateReelle: '2026-01-15' },
      { nom: 'Modélisation hydrogéologique', datePrevue: '2026-05-31', statut: 'pending' },
      { nom: 'Rapport final et cartes', datePrevue: '2026-08-15', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Réactifs', montant: 11000000, date: '2024-12-01', description: 'Kits d\'analyse chimique et isotopique' },
      { categorie: 'Transport', montant: 14000000, date: '2025-03-15', description: 'Véhicules et carburant missions Nord' },
      { categorie: 'Personnel', montant: 10000000, date: '2025-08-01', description: 'Techniciens de prélèvement' },
      { categorie: 'Équipement', montant: 6000000, date: '2025-11-01', description: 'Sondes piézométriques' },
    ],
    documents: [
      { nom: 'Protocole hydrogéochimique', type: 'protocole', statut: 'valid' },
      { nom: 'Rapport analyses phase 1', type: 'rapport', statut: 'valid' },
      { nom: 'Rapport analyses phase 2', type: 'rapport', statut: 'pending' },
    ],
  },

  // ── MIPROMALO ──
  {
    intitule: "Valorisation de la latérite pour la construction de logements sociaux",
    description: "Optimisation des briques de terre comprimée (BTC) à base de latérite stabilisée pour réduire de 40% le coût de construction des logements sociaux.",
    domaine: 'Matériaux',
    statut: 'En cours',
    inst: 'MIPROMALO',
    dateDebut: '2025-04-01',
    dateFin: '2026-09-30',
    budgetInitial: 55000000,
    budgetDepense: 22000000,
    bailleurs: [{ source: 'MINRESI', montant: 30000000 }, { source: 'MINDHU', montant: 25000000 }],
    milestones: [
      { nom: 'Caractérisation des gisements de latérite', datePrevue: '2025-07-31', statut: 'done', dateReelle: '2025-07-25' },
      { nom: 'Formulation optimale BTC', datePrevue: '2025-12-31', statut: 'done', dateReelle: '2026-01-10' },
      { nom: 'Tests mécaniques et durabilité', datePrevue: '2026-04-30', statut: 'pending' },
      { nom: 'Construction prototype', datePrevue: '2026-08-31', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Matières premières', montant: 8000000, date: '2025-05-15', description: 'Latérite, ciment, chaux' },
      { categorie: 'Équipement', montant: 9000000, date: '2025-06-20', description: 'Presse BTC et moules' },
      { categorie: 'Personnel', montant: 5000000, date: '2025-10-01', description: 'Main d\'œuvre technique' },
    ],
    documents: [
      { nom: 'Protocole de formulation BTC', type: 'protocole', statut: 'valid' },
      { nom: 'Normes de construction BTC', type: 'autre', statut: 'valid' },
    ],
  },

  // ── ANRP ──
  {
    intitule: "Cartographie nationale des sources de rayonnements ionisants",
    description: "Recensement et géolocalisation de toutes les sources de rayonnements ionisants utilisées dans les secteurs médical, industriel et de recherche au Cameroun.",
    domaine: 'Radioprotection',
    statut: 'En préparation',
    inst: 'ANRP',
    dateDebut: '2026-01-01',
    dateFin: '2027-06-30',
    budgetInitial: 48000000,
    budgetDepense: 0,
    bailleurs: [{ source: 'AIEA', montant: 30000000 }, { source: 'MINRESI', montant: 18000000 }],
    milestones: [
      { nom: 'Élaboration du questionnaire de recensement', datePrevue: '2026-03-31', statut: 'pending' },
      { nom: 'Enquête nationale', datePrevue: '2026-09-30', statut: 'pending' },
      { nom: 'Base de données géoréférencée', datePrevue: '2027-03-31', statut: 'pending' },
    ],
    depenses: [],
    documents: [
      { nom: 'Proposition de projet AIEA', type: 'protocole', statut: 'pending' },
    ],
  },

  // ── CNE ──
  {
    intitule: "Évaluation de l'impact du bilinguisme sur les performances scolaires",
    description: "Étude comparative des performances des élèves bilingues français-anglais dans les régions du Centre, du Littoral, du Nord-Ouest et du Sud-Ouest.",
    domaine: 'Éducation',
    statut: 'Clôturé',
    inst: 'CNE',
    dateDebut: '2024-01-15',
    dateFin: '2025-12-31',
    budgetInitial: 38000000,
    budgetDepense: 36500000,
    bailleurs: [{ source: 'UNESCO', montant: 22000000 }, { source: 'MINRESI', montant: 16000000 }],
    milestones: [
      { nom: 'Conception des instruments de collecte', datePrevue: '2024-04-30', statut: 'done', dateReelle: '2024-04-25' },
      { nom: 'Enquête dans 120 établissements', datePrevue: '2024-10-31', statut: 'done', dateReelle: '2024-11-10' },
      { nom: 'Analyse statistique des données', datePrevue: '2025-05-31', statut: 'done', dateReelle: '2025-06-05' },
      { nom: 'Rapport final et recommandations', datePrevue: '2025-11-30', statut: 'done', dateReelle: '2025-11-28' },
    ],
    depenses: [
      { categorie: 'Personnel', montant: 14000000, date: '2024-06-01', description: 'Enquêteurs et superviseurs' },
      { categorie: 'Transport', montant: 11000000, date: '2024-08-15', description: 'Déplacements dans 4 régions' },
      { categorie: 'Logiciels', montant: 3500000, date: '2024-03-10', description: 'SPSS et NVivo' },
      { categorie: 'Formation', montant: 4000000, date: '2024-05-20', description: 'Formation des enquêteurs' },
      { categorie: 'Divers', montant: 4000000, date: '2025-09-01', description: 'Impression et diffusion du rapport' },
    ],
    documents: [
      { nom: 'Rapport final — Bilinguisme et performances', type: 'rapport', statut: 'valid' },
      { nom: 'Protocole méthodologique', type: 'protocole', statut: 'valid' },
      { nom: 'Budget exécuté', type: 'budget', statut: 'valid' },
      { nom: 'Convention UNESCO-CNE', type: 'contrat', statut: 'valid' },
    ],
  },

  // ── CNDT ──
  {
    intitule: "Transfert de technologies solaires pour l'électrification rurale",
    description: "Adaptation et transfert de technologies de panneaux solaires pour les communautés rurales des régions de l'Est et de l'Adamaoua non raccordées au réseau électrique.",
    domaine: 'Technologie',
    statut: 'En cours',
    inst: 'CNDT',
    dateDebut: '2025-07-01',
    dateFin: '2027-06-30',
    budgetInitial: 110000000,
    budgetDepense: 15000000,
    bailleurs: [{ source: 'INRIA', montant: 35000000 }, { source: 'GIZ', montant: 45000000 }, { source: 'MINRESI', montant: 30000000 }],
    milestones: [
      { nom: 'Étude de faisabilité et cartographie des besoins', datePrevue: '2025-10-31', statut: 'done', dateReelle: '2025-10-28' },
      { nom: 'Sélection des 20 villages pilotes', datePrevue: '2026-02-28', statut: 'pending' },
      { nom: 'Installation des systèmes solaires', datePrevue: '2026-09-30', statut: 'pending' },
      { nom: 'Formation des techniciens locaux', datePrevue: '2027-01-31', statut: 'pending' },
      { nom: 'Évaluation d\'impact', datePrevue: '2027-05-31', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Transport', montant: 8000000, date: '2025-08-15', description: 'Missions de terrain Est et Adamaoua' },
      { categorie: 'Personnel', montant: 7000000, date: '2025-10-01', description: 'Consultants en énergie solaire' },
    ],
    documents: [
      { nom: 'Étude de faisabilité — Solaire rural', type: 'rapport', statut: 'valid' },
      { nom: 'Convention tripartite INRIA-GIZ-CNDT', type: 'contrat', statut: 'valid' },
      { nom: 'Cahier des charges techniques', type: 'protocole', statut: 'pending' },
    ],
  },

  // ── Projets supplémentaires ──
  {
    intitule: "Surveillance sismique du Mont Cameroun et du Lac Nyos",
    description: "Renforcement du réseau de surveillance sismique et géochimique pour la prévention des risques volcaniques et limnologiques.",
    domaine: 'Géologie',
    statut: 'En cours',
    inst: 'IRGM',
    dateDebut: '2024-06-01',
    dateFin: '2026-05-31',
    budgetInitial: 88000000,
    budgetDepense: 52000000,
    bailleurs: [{ source: 'PNUD', montant: 50000000 }, { source: 'État du Cameroun', montant: 38000000 }],
    milestones: [
      { nom: 'Installation de 5 stations sismiques', datePrevue: '2024-12-31', statut: 'done', dateReelle: '2024-12-20' },
      { nom: 'Campagne de mesures géochimiques Lac Nyos', datePrevue: '2025-06-30', statut: 'done', dateReelle: '2025-07-05' },
      { nom: 'Modélisation des aléas', datePrevue: '2026-01-31', statut: 'pending' },
      { nom: 'Plan d\'évacuation communautaire', datePrevue: '2026-04-30', statut: 'pending' },
    ],
    depenses: [
      { categorie: 'Équipement', montant: 28000000, date: '2024-09-15', description: 'Sismomètres et capteurs géochimiques' },
      { categorie: 'Transport', montant: 12000000, date: '2025-02-01', description: 'Logistique Mont Cameroun et Nyos' },
      { categorie: 'Personnel', montant: 12000000, date: '2025-08-01', description: 'Techniciens de maintenance réseau' },
    ],
    documents: [
      { nom: 'Protocole de surveillance sismique', type: 'protocole', statut: 'valid' },
      { nom: 'Rapport semestriel S1-2025', type: 'rapport', statut: 'valid' },
      { nom: 'Convention PNUD', type: 'contrat', statut: 'valid' },
    ],
  },
];

const INNOVATIONS = [
  { nom: "Agri'Smart", description: "Application mobile d'aide à la décision pour le conseil agricole. Recommandations personnalisées basées sur les données locales de sol et climat.", domaine: 'Agriculture', image: '/innovation-1.png', auteur: 'Team AgriTech — IRAD', inst: 'IRAD' },
  { nom: 'MedSahara', description: "Dispositif de diagnostic médical portable alimenté par énergie solaire. Permet des analyses biologiques de base en zone rurale sans électricité.", domaine: 'Santé', image: '/innovation-2.png', auteur: 'Équipe Santé Numérique — IMPM', inst: 'IMPM' },
  { nom: 'EcoBrique', description: "Brique écologique à base de matériaux locaux (latérite stabilisée). Réduit de 40% le coût de construction des logements sociaux.", domaine: 'Matériaux', image: '/innovation-3.png', auteur: 'Labo Matériaux — MIPROMALO', inst: 'MIPROMALO' },
  { nom: 'GéoRisk Map', description: "Plateforme web de cartographie des risques naturels (inondations, glissements de terrain, séismes) pour la prévention des catastrophes.", domaine: 'Géologie', image: '', auteur: 'Cellule SIG — IRGM', inst: 'IRGM' },
  { nom: 'SolarVillage', description: "Kit solaire modulaire pour l'électrification des villages ruraux. Installation en 48h, autonomie complète, maintenance simplifiée.", domaine: 'Technologie', image: '', auteur: 'Programme EnR — CNDT', inst: 'CNDT' },
  { nom: 'EduCam 360', description: "Plateforme numérique d'apprentissage adaptatif pour les écoles primaires et secondaires, compatible hors-ligne.", domaine: 'Éducation', image: '', auteur: 'Équipe EdTech — CNE', inst: 'CNE' },
];

// ══════════════════════════════════════════════════════
//  EXÉCUTION DU SEED
// ══════════════════════════════════════════════════════

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB Atlas\n');

    // ── 1. Instituts ──
    console.log('══ INSTITUTS ══');
    const iMap = {};
    for (const inst of INSTITUTES) {
      await Institute.deleteOne({ code: inst.code });
      const created = await Institute.create(inst);
      iMap[inst.code] = created._id;
      console.log(`  + ${inst.sigle.padEnd(10)} — ${inst.nom}`);
    }

    // ── 2. Utilisateurs ──
    console.log('\n══ UTILISATEURS ══');
    const demoEmails = USERS.map(u => u.email.toLowerCase());
    await User.deleteMany({ email: { $in: demoEmails } });
    const uMap = {};
    for (const u of USERS) {
      const userData = {
        prenom: u.prenom, nom: u.nom, email: u.email,
        password: u.password, role: u.role,
        isVerified: true, actif: true,
        institute: u.inst ? iMap[u.inst] : null,
      };
      const created = await User.create(userData);
      uMap[u.email] = created._id;
      const tag = u.role === 'dev' ? '🔑' : '👤';
      console.log(`  ${tag} ${u.email.padEnd(28)} (${u.role})`);
    }

    // ── 3. Chercheurs ──
    console.log('\n══ CHERCHEURS ══');
    await Researcher.deleteMany({});
    const rMap = {};
    for (const r of RESEARCHERS) {
      const created = await Researcher.create({
        prenom: r.prenom, nom: r.nom, email: r.email,
        telephone: r.telephone, grade: r.grade,
        specialite: r.specialite, institute: iMap[r.inst],
      });
      rMap[r.email] = created._id;
      console.log(`  + ${(r.prenom + ' ' + r.nom).padEnd(25)} — ${r.inst} — ${r.grade}`);
    }

    // ── 4. Projets ──
    console.log('\n══ PROJETS ══');
    await Project.deleteMany({});
    let pNum = 1;
    for (const p of PROJECTS) {
      const code = `P${String(pNum++).padStart(3, '0')}`;
      const chefId = uMap['chef@minresi.cm'];
      const devId = uMap['noutchangyvana@gmail.com'];

      const chercheurIds = RESEARCHERS
        .filter(r => r.inst === p.inst)
        .map(r => rMap[r.email])
        .filter(Boolean)
        .slice(0, 3);

      const projectData = {
        code, intitule: p.intitule, description: p.description,
        domaine: p.domaine, statut: p.statut,
        institute: iMap[p.inst],
        chefProjet: chefId,
        chercheurs: chercheurIds,
        dateDebut: new Date(p.dateDebut),
        dateFin: new Date(p.dateFin),
        budgetInitial: p.budgetInitial,
        budgetDepense: p.budgetDepense,
        bailleurs: p.bailleurs,
        creePar: devId,
        milestones: p.milestones.map(m => ({
          nom: m.nom,
          datePrevue: new Date(m.datePrevue),
          dateReelle: m.dateReelle ? new Date(m.dateReelle) : null,
          statut: m.statut,
          responsable: chercheurIds.length > 0 ? null : null,
        })),
        depenses: p.depenses.map(d => ({
          categorie: d.categorie,
          montant: d.montant,
          date: new Date(d.date),
          description: d.description,
          saisiePar: chefId,
        })),
        documents: p.documents.map(d => ({
          nom: d.nom,
          type: d.type,
          statut: d.statut,
          uploadePar: devId,
          valideePar: d.statut === 'valid' ? chefId : null,
          dateValidation: d.statut === 'valid' ? new Date() : null,
        })),
      };

      await Project.create(projectData);
      console.log(`  + ${code} — ${p.intitule.substring(0, 65)}...`);
    }

    // ── 5. Innovations ──
    console.log('\n══ INNOVATIONS ══');
    await Innovation.deleteMany({});
    for (const inn of INNOVATIONS) {
      await Innovation.create({
        nom: inn.nom, description: inn.description, domaine: inn.domaine,
        image: inn.image, auteur: inn.auteur,
        institute: inn.inst ? iMap[inn.inst] : null,
        statut: 'publie', actif: true,
      });
      console.log(`  + ${inn.nom} — ${inn.domaine}`);
    }

    // ── Résumé ──
    console.log('\n══════════════════════════════════════════');
    console.log('  ✅ SEED TERMINÉ AVEC SUCCÈS !');
    console.log('══════════════════════════════════════════');
    console.log(`  ${INSTITUTES.length} instituts`);
    console.log(`  ${USERS.length} utilisateurs`);
    console.log(`  ${RESEARCHERS.length} chercheurs`);
    console.log(`  ${PROJECTS.length} projets de recherche`);
    console.log(`  ${INNOVATIONS.length} innovations`);
    console.log('\n── Comptes ──');
    console.log('  🔑 noutchangyvana@gmail.com / Yvana2026   → DEV (accès total)');
    console.log('  👤 admin@minresi.cm / admin123             → Admin');
    console.log('  👤 dir@minresi.cm / dir123                 → Directeur');
    console.log('  👤 chef@minresi.cm / chef123               → Chef de projet');
    console.log('  👤 comptable@minresi.cm / compta123        → Comptable');
    console.log('  👤 chercheur@minresi.cm / ch123            → Chercheur');
    console.log('══════════════════════════════════════════\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Erreur seed:', err.message);
    process.exit(1);
  }
})();
