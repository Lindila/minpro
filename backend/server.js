const express = require('express');
const path    = require('path');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes API
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/projects',    require('./routes/project.routes'));
app.use('/api/users',       require('./routes/user.routes'));
app.use('/api/researchers', require('./routes/researcher.routes'));
app.use('/api/institutes',  require('./routes/institute.routes'));
app.use('/api/activities',  require('./routes/activity.routes'));
app.use('/api/innovations',  require('./routes/innovation.routes'));
app.use('/api/public',      require('./routes/public.routes'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'OK', app: 'SIGPRO-MINRESI API' }));

// En production : servir le frontend buildé
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  app.use((_req, res) => res.status(404).json({ success: false, message: 'Route introuvable' }));
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur interne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  SIGPRO-MINRESI API on http://localhost:${PORT}`);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}\n`);
});
