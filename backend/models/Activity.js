const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['project_created', 'project_updated', 'milestone_added', 'milestone_done',
           'expense_added', 'document_uploaded', 'document_validated', 'document_rejected',
           'user_registered', 'user_login', 'budget_updated'],
    required: true,
  },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  details:   { type: String },
  metadata:  { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

ActivitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
