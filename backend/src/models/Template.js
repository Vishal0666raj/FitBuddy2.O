const mongoose = require('mongoose');
const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscle_group: String, // chest, back, legs, shoulders, arms, core, cardio
  target_sets: { type: Number, default: 3 },
  target_reps: { type: Number, default: 8 },
  notes: String,
}, { _id: true });
const TemplateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true }, // e.g. Push Day
  color: { type: String, default: '#ff6a3d' },
  exercises: [ExerciseSchema],
}, { timestamps: true });
module.exports = mongoose.model('Template', TemplateSchema);
