const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/reminder.controller');
r.use(auth);
r.get('/', c.get);
r.put('/', c.update);
r.post('/test', c.test);
module.exports = r;
