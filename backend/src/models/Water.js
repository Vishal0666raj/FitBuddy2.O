const mongoose = require('mongoose');
const WaterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  ml: { type: Number, default: 0 },
}, { timestamps: true });
WaterSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Water', WaterSchema);
