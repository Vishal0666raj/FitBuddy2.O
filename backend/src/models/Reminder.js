const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  email_enabled: { type: Boolean, default: false },
  workout_time: { type: String, default: '06:00' }, // HH:MM 24h, local UTC offset stored separately
  tz_offset_min: { type: Number, default: 0 }, // minutes from UTC (client provided)
  water_enabled: { type: Boolean, default: false },
  water_interval_hours: { type: Number, default: 2, min: 1, max: 6 },
  water_start_hour: { type: Number, default: 8 },
  water_end_hour: { type: Number, default: 22 },
  last_water_sent: Date,
  last_workout_sent: Date,
}, { timestamps: true });
module.exports = mongoose.model('Reminder', ReminderSchema);
