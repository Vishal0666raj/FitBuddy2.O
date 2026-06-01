const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/water.controller');
r.use(auth);
r.get('/', c.range);  // ?from=&to=
r.post('/', c.add);   // body: { date, ml }
module.exports = r;
