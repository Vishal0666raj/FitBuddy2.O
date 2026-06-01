const Water = require('../models/Water');
exports.range = async (req, res) => {
  const { from, to } = req.query;
  const filter = { user: req.userId };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = from;
  if (to) filter.date.$lte = to;
  res.json(await Water.find(filter).sort('date'));
};
exports.add = async (req, res) => {
  const { date, ml } = req.body;
  const w = await Water.findOneAndUpdate({ user: req.userId, date }, { $inc: { ml: +ml || 0 } }, { upsert: true, new: true });
  res.json(w);
};
