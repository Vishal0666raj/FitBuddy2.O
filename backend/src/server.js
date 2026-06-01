require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { startScheduler } = require('./services/scheduler');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/schedule', require('./routes/schedule.routes'));
app.use('/api/water', require('./routes/water.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/reminders', require('./routes/reminder.routes'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5004;
connectDB().then(() => {
  app.listen(PORT, () => console.log('fitBuddy API on :' + PORT));
  startScheduler();
});
