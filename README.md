# SIGPRO-MINRESI

**Système Intégré de Gestion des Projets de Recherche du MINRESI**  
Ministère de la Recherche Scientifique et de l'Innovation — République du Cameroun

---

## 🗂️ Structure du projet

```
sigpro-minresi/
├── backend/               Node.js + Express + MongoDB
│   ├── config/db.js       Connexion MongoDB
│   ├── controllers/       Logique métier (auth, projets, users, ...)
│   ├── middleware/        JWT + RBAC
│   ├── models/            Schemas Mongoose (Project, User, Institute, Researcher)
│   ├── routes/            Routers Express
│   ├── scripts/seed.js    Peuplement base de données
│   ├── server.js          Point d'entrée
│   └── package.json
│
└── frontend/              React 18 + Vite + Context API
    └── src/
        ├── api/           Couche HTTP Axios
        ├── components/
        │   ├── charts/    LineChart, PieChart, BarChart (Chart.js)
        │   ├── layout/    Sidebar, Topbar, Layout, PrivateRoute
        │   ├── modals/    Modals de création (projet, jalon, dépense, doc, user)
        │   └── ui/        Badge, Button, Card, Modal, FormField, BudgetBar, Loader
        ├── context/       AuthContext + AppContext (i18n FR/EN)
        ├── pages/         Login, Dashboard, Projects, ProjectDetail, Researchers, Users
        └── utils/         formatters, dateUtils, constants
```

---

## ⚡ Prérequis

- **Node.js** ≥ 18
- **MongoDB** installé localement (port 27017 par défaut)

---

## 🚀 Installation et démarrage

### 1. Base de données

Démarrez MongoDB sur votre machine. Sous Windows, ouvrez un terminal et exécutez :
```bash
mongod
```

### 2. Backend

```bash
cd backend

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env si besoin (MONGODB_URI, JWT_SECRET...)

# Installer les dépendances
npm install

# Peupler la base avec les données de démo
npm run seed

# Démarrer le serveur (port 5000)
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer l'interface (port 5173)
npm run dev
```

Ouvrir **http://localhost:5173** dans le navigateur.

---

## 🔑 Comptes de connexion (démo)

| Rôle             | Email                    | Mot de passe |
|------------------|--------------------------|--------------|
| Admin MINRESI    | admin@minresi.cm         | admin123     |
| Chef de projet   | chef@minresi.cm          | chef123      |
| Directeur Inst.  | dir@minresi.cm           | dir123       |
| Chercheur        | chercheur@minresi.cm     | ch123        |

---

## 🔐 Rôles et permissions

| Action                        | Admin | Chef | Directeur | Chercheur |
|-------------------------------|-------|------|-----------|-----------|
| Voir les projets              | ✅    | ✅   | ✅ (inst) | ✅ (siens)|
| Créer un projet               | ✅    | ✅   | ❌        | ❌        |
| Ajouter jalons / dépenses     | ✅    | ✅   | ❌        | ❌        |
| Valider des documents         | ✅    | ✅   | ✅        | ❌        |
| Gérer les utilisateurs        | ✅    | ❌   | ❌        | ❌        |

---

## 🌐 API REST

| Méthode | Route                                        | Description                  |
|---------|----------------------------------------------|------------------------------|
| POST    | /api/auth/login                              | Connexion JWT                |
| GET     | /api/auth/me                                 | Utilisateur courant          |
| GET     | /api/projects                                | Liste des projets            |
| POST    | /api/projects                                | Créer un projet              |
| GET     | /api/projects/:id                            | Détail d'un projet           |
| PUT     | /api/projects/:id                            | Modifier un projet           |
| GET     | /api/projects/stats                          | Statistiques dashboard       |
| GET     | /api/projects/alerts                         | Alertes en temps réel        |
| POST    | /api/projects/:id/milestones                 | Ajouter un jalon             |
| PUT     | /api/projects/:id/milestones/:msId           | Modifier un jalon            |
| DELETE  | /api/projects/:id/milestones/:msId           | Supprimer un jalon           |
| POST    | /api/projects/:id/depenses                   | Saisir une dépense           |
| DELETE  | /api/projects/:id/depenses/:expId            | Supprimer une dépense        |
| POST    | /api/projects/:id/documents                  | Déposer un document          |
| PUT     | /api/projects/:id/documents/:docId/validate  | Valider un document          |
| PUT     | /api/projects/:id/documents/:docId/reject    | Rejeter un document          |
| GET     | /api/users                                   | Gestion utilisateurs (admin) |
| GET     | /api/researchers                             | Annuaire chercheurs          |
| GET     | /api/institutes                              | Liste des instituts          |

---

## 🏛️ Instituts inclus

- **IRAD** — Institut de Recherche Agricole pour le Développement
- **IMPM** — Institut de Recherches Médicales et Plantes Médicinales
- **IRGM** — Institut de Recherches Géologiques et Minières
- **INC**  — Institut National de Cartographie
- **ANRP** — Agence Nationale de Radioprotection
- **MIPROMALO** — Mission de Promotion des Matériaux Locaux
- **CNE**  — Centre National d'Éducation
- **CNDT** — Comité National de Développement des Technologies

---

## 📦 Technologies utilisées

### Backend
- Node.js, Express 4
- MongoDB, Mongoose 8
- JWT (jsonwebtoken), bcryptjs
- dotenv, cors

### Frontend
- React 18, Vite 5
- React Router DOM v6
- Axios (HTTP client + intercepteurs JWT)
- Chart.js + react-chartjs-2
- Tabler Icons (CDN)
- Context API pour l'état global

---

## 🌍 Internationalisation

L'application est disponible en **français** et **anglais**.  
Le bouton de bascule FR/EN est disponible dans la sidebar et sur la page de connexion.

---

*© 2025–2026 MINRESI – République du Cameroun*
