const Reminder = require('../models/Reminder');
const { sendMail } = require('../services/mailer');
exports.get = async (req, res) => {
  let r = await Reminder.findOne({ user: req.userId });
  if (!r) r = await Reminder.create({ user: req.userId });
  res.json(r);
};
exports.update = async (req, res) => {
  const allowed = ['email_enabled','workout_time','tz_offset_min','water_enabled','water_interval_hours','water_start_hour','water_end_hour'];
  const patch = {}; for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const r = await Reminder.findOneAndUpdate({ user: req.userId }, { $set: patch }, { new: true, upsert: true });
  res.json(r);
};
exports.test = async (req, res) => {
  try {
    await sendMail({ to: req.userEmail, subject: 'fitBuddy — test reminder', html: '<p>Your email reminders are working ✅</p>' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
