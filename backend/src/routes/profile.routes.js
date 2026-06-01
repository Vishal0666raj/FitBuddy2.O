const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/profile.controller');
r.use(auth);
r.get('/', c.get);
r.put('/', c.update);
module.exports = r;
