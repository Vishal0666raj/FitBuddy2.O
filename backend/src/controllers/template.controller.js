const Template = require('../models/Template');
exports.list = async (req, res) => res.json(await Template.find({ user: req.userId }).sort('-updatedAt'));
exports.get = async (req, res) => res.json(await Template.findOne({ _id: req.params.id, user: req.userId }));
exports.create = async (req, res) => res.json(await Template.create({ ...req.body, user: req.userId }));
exports.update = async (req, res) => res.json(await Template.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true }));
exports.remove = async (req, res) => { await Template.deleteOne({ _id: req.params.id, user: req.userId }); res.json({ ok: true }); };
