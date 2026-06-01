const Session = require('../models/Session');
const Template = require('../models/Template');

exports.list = async (req, res) => {
  const { page = 1, limit = 20, from, to, template, status, q } = req.query;
  const filter = { user: req.userId };
  if (template && template !== 'all') filter.template = template;
  if (status === 'completed') filter.completed = true;
  if (status === 'in_progress') filter.completed = false;
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  if (q) filter.name = new RegExp(q, 'i');
  const p = Math.max(1, +page), l = Math.min(100, +limit);
  const [items, total] = await Promise.all([
    Session.find(filter).sort('-date').skip((p-1)*l).limit(l),
    Session.countDocuments(filter),
  ]);
  res.json({ items, total, page: p, pages: Math.ceil(total/l) });
};

exports.get = async (req, res) => res.json(await Session.findOne({ _id: req.params.id, user: req.userId }));

exports.create = async (req, res) => {
  let { template, name, logs } = req.body;
  if (template && (!logs || !logs.length)) {
    const t = await Template.findOne({ _id: template, user: req.userId });
    if (t) {
      name = name || t.name;
      logs = t.exercises.map((e, i) => ({
        exercise_name: e.name, muscle_group: e.muscle_group, order: i,
        sets: Array.from({ length: e.target_sets || 3 }, () => ({ weight_kg: 0, reps: e.target_reps || 0, done: false })),
      }));
    }
  }
  res.json(await Session.create({ user: req.userId, template, name: name || 'Workout', logs: logs || [] }));
};

exports.update = async (req, res) => {
  const s = await Session.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
  res.json(s);
};
exports.remove = async (req, res) => { await Session.deleteOne({ _id: req.params.id, user: req.userId }); res.json({ ok: true }); };
