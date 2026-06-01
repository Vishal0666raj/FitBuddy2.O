const Profile = require('../models/Profile');
exports.get = async (req, res) => {
  let p = await Profile.findOne({ user: req.userId });
  if (!p) p = await Profile.create({ user: req.userId });
  res.json(p);
};
exports.update = async (req, res) => {
  const allowed = ['name','age','gender','height_cm','weight_kg','daily_water_goal_ml','weekly_workout_goal'];
  const patch = {}; for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const p = await Profile.findOneAndUpdate({ user: req.userId }, { $set: patch }, { new: true, upsert: true });
  res.json(p);
};
