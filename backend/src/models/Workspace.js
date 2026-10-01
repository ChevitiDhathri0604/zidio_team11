const mongoose = require('mongoose');

const ActionItemSchema = new mongoose.Schema({
  task: { type: String, required: true },
  assignee: { type: String, default: 'Unassigned' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: { type: String, default: 'TBD' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const WorkspaceSchema = new mongoose.Schema({
  meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
  title: { type: String, required: true },
  transcript: [{
    speaker: String,
    text: String,
    timestamp: String
  }],
  summary: { type: String, default: '' },
  keyPoints: [{ type: String }],
  decisions: [{ type: String }],
  actionItems: [ActionItemSchema],
  chatHistory: [{
    sender: String,
    text: String,
    timestamp: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', WorkspaceSchema);
