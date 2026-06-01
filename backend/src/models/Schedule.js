const mongoose = require('mongoose');
// One entry per (user, dow 0-6)
const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dow: { type: Number, min: 0, max: 6, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
}, { timestamps: true });
ScheduleSchema.index({ user: 1, dow: 1 }, { unique: true });
module.exports = mongoose.model('Schedule', ScheduleSchema);
