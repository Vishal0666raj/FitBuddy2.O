const r = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/analytics.controller');
r.use(auth);
r.get('/exercises', c.exercises);                 // unique exercise list with muscle group
r.get('/exercise', c.exerciseProgression);        // ?name=&from=&to=
r.get('/muscle', c.muscleProgression);            // ?group=&from=&to=
r.get('/template', c.templateProgression);        // ?template=&from=&to=
module.exports = r;
