const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/session.controller');
r.use(auth);
r.get('/', c.list);              // supports ?page=&limit=&from=&to=&template=&status=&q=
r.post('/', c.create);
r.get('/:id', c.get);
r.put('/:id', c.update);
r.delete('/:id', c.remove);
module.exports = r;
