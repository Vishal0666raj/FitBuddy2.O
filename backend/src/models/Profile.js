const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  name: String,
  age: Number,
  gender: String,
  height_cm: Number,
  weight_kg: Number,
  daily_water_goal_ml: { type: Number, default: 2500 },
  weekly_workout_goal: { type: Number, default: 4 },
}, { timestamps: true });
module.exports = mongoose.model('Profile', ProfileSchema);
