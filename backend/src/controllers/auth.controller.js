const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Reminder = require('../models/Reminder');

function sign(u){ return jwt.sign({ id: u._id.toString(), email: u.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' }); }

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  await Profile.create({ user: user._id, name: name || email.split('@')[0] });
  await Reminder.create({ user: user._id });
  res.json({ token: sign(user), user: { id: user._id, email: user.email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  console.log("USER FOUND:");
  console.log(user);

  console.log("passwordHash =", user?.passwordHash);
  console.log("password =", user?.password);

  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok)
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    token: sign(user),
    user: {
      id: user._id,
      email: user.email
    }
  });
};
