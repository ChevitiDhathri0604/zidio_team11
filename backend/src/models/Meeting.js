const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['scheduled', 'active', 'ended'], default: 'scheduled' },
  scheduledAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
