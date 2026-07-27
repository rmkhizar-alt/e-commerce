const jwt = require('jsonwebtoken');
const DeliveryBoy = require('../models/DeliveryBoy');

// Delivery boys log in separately from customers/admins, so they get their
// own JWT check here rather than reusing middleware/auth.js's requireAuth
// (which looks up the User model). Uses the same JWT_SECRET as the rest of
// the app for simplicity — the payload shape (`role: 'delivery'`) is what
// keeps the two token types from being interchangeable.
async function requireDeliveryAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated. Please log in.' });
    }
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== 'delivery') {
      return res.status(401).json({ error: 'Invalid token for this endpoint.' });
    }

    const deliveryBoy = await DeliveryBoy.findById(payload.sub);
    if (!deliveryBoy || !deliveryBoy.isActive) {
      return res.status(401).json({ error: 'Account not found or disabled.' });
    }

    req.deliveryBoy = deliveryBoy;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = { requireDeliveryAuth };
