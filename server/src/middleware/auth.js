const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRole(roleName) {
  return (req, res, next) => {
    const roles = (req.user && req.user.roles) || [];
    if (roles.includes('Admin')) return next();
    if (roles.includes(roleName)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { authRequired, requireRole };


