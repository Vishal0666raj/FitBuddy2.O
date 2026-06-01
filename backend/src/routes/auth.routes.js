const r = require('express').Router();
const { z } = require('zod');
const validate = require('../middleware/validate');
const c = require('../controllers/auth.controller');
r.post('/register', validate(z.object({ email: z.string().email(), password: z.string().min(6).max(128), name: z.string().max(80).optional() })), c.register);
r.post('/login', validate(z.object({ email: z.string().email(), password: z.string().min(1) })), c.login);
module.exports = r;
