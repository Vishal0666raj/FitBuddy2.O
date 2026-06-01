const mongoose = require('mongoose');
const SetSchema = new mongoose.Schema({
  weight_kg: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  rpe: Number,
  done: { type: Boolean, default: true },
}, { _id: true });
const LogSchema = new mongoose.Schema({
  exercise_name: { type: String, required: true, index: true },
  muscle_group: String,
  order: { type: Number, default: 0 },
  sets: [SetSchema],
}, { _id: true });
const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  name: String,
  date: { type: Date, default: Date.now, index: true },
  duration_min: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  notes: String,
  logs: [LogSchema],
}, { timestamps: true });
SessionSchema.index({ user: 1, date: -1 });
module.exports = mongoose.model('Session', SessionSchema);
