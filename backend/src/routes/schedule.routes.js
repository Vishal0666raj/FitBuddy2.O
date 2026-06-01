const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/schedule.controller');
r.use(auth);
r.get('/', c.list);
r.put('/', c.set); // body: { dow, template }
module.exports = r;
