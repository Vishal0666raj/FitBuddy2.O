const Schedule = require('../models/Schedule');
exports.list = async (req, res) => res.json(await Schedule.find({ user: req.userId }).populate('template'));
exports.set = async (req, res) => {
  const { dow, template } = req.body;
  const s = await Schedule.findOneAndUpdate({ user: req.userId, dow }, { template: template || null }, { upsert: true, new: true });
  res.json(s);
};
