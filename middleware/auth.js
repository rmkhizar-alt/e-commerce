const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getTokenFromHeader(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

// Blocks the request if there's no valid token. Use on routes that require login.
async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated. Please log in.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Attaches req.user if a valid token is present, but doesn't block guests.
// Used on routes like order creation, which supports guest checkout.
async function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
    next();
  } catch (err) {
    // Bad/expired token on an optional route - just proceed as guest
    next();
  }
}

// Use after requireAuth on routes only admins should reach (e.g. product management)
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };
