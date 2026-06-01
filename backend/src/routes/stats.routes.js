const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/stats.controller');
r.use(auth);
r.get('/dashboard', c.dashboard);
r.get('/heatmap', c.heatmap);
module.exports = r;
