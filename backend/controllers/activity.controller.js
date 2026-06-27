const Activity = require('../models/Activity');

const log = async (type, userId, projectId, details, metadata) => {
  try {
    await Activity.create({ type, user: userId, project: projectId || null, details, metadata });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

const getActivities = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const activities = await Activity.find()
      .populate('user', 'prenom nom role')
      .populate('project', 'intitule code')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { log, getActivities };
