module.exports = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ message: 'Invalid input', issues: r.error.issues });
  req.body = r.data; next();
};
