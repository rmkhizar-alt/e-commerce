const Order = require('../models/Order');
const { isDbReady } = require('../config/db');
const { sendWhatsAppMessageTo, sendWhatsAppMessage } = require('../utils/whatsapp');

// Generates a short, human-friendly, (very likely) unique order number,
// e.g. "SC3D-M5F2K8-4T1Q". Uniqueness is still enforced by the schema's
// unique index; createOrder() retries a couple of times on collision.
function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SC3D-${time}-${rand}`;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// WhatsApp numbers need digits only, country code, no leading 0 and no '+'
// (e.g. "923001234567"). Checkout accepts both "03001234567" and
// "+923001234567" formats, so this normalizes either into what
// sendWhatsAppMessageTo() expects.
function normalizePhoneForWhatsApp(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = '92' + digits.slice(1);
  return digits;
}

// Validates the request body for creating an order. Returns an error
// message string if invalid, or null if everything checks out.
function validateOrderInput(body) {
  const { items, shipping } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return 'Your order needs at least one item.';
  }
  for (const item of items) {
    if (!isNonEmptyString(item.productId)) return 'Each item needs a productId.';
    if (!isNonEmptyString(item.name)) return 'Each item needs a name.';
    if (typeof item.price !== 'number' || item.price < 0) return 'Each item needs a valid price.';
    if (typeof item.qty !== 'number' || item.qty < 1) return 'Each item needs a quantity of at least 1.';
  }

  if (!shipping || typeof shipping !== 'object') return 'Shipping details are required.';
  const requiredShippingFields = ['name', 'email', 'line1', 'city', 'country'];
  for (const field of requiredShippingFields) {
    if (!isNonEmptyString(shipping[field])) return `Shipping ${field} is required.`;
  }

  return null;
}

// POST /api/orders  (optionalAuth — guest checkout is explicitly supported)
async function createOrder(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot place your order right now — database is offline. Please try again shortly.' });
    }

    const validationError = validateOrderInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { items, shipping, paymentMethod, paymentMobileNumber, transactionId } = req.body;

    // Snapshot item data exactly as sent by the client (name/price at time
    // of order, per the Order schema's own comments) rather than trusting
    // a client-supplied subtotal/total — those are always recomputed here.
    const cleanItems = items.map((item) => ({
      productId: String(item.productId),
      name: String(item.name),
      price: Number(item.price),
      qty: Math.floor(Number(item.qty)),
      opts: item.opts && typeof item.opts === 'object' ? item.opts : {}
    }));

    const subtotal = cleanItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingFee = Number(req.body.shippingFee) > 0 ? Number(req.body.shippingFee) : 0;
    const total = subtotal + shippingFee;

    const allowedPaymentMethods = ['cod', 'card', 'easypaisa', 'jazzcash'];
    const paymentMethodClean = allowedPaymentMethods.includes(paymentMethod) ? paymentMethod : 'cod';

    // Easypaisa orders aren't processed through a gateway - the customer
    // transfers the money themselves via their own Easypaisa app and reports
    // back the sending number + Transaction ID, which an admin later checks
    // against the real Easypaisa account before marking the order paid.
    if (paymentMethodClean === 'easypaisa') {
      if (!isNonEmptyString(paymentMobileNumber) || !isNonEmptyString(transactionId)) {
        return res.status(400).json({ error: 'Easypaisa payments require your sending number and Transaction ID.' });
      }
    }

    const orderData = {
      user: req.user ? req.user._id : null,
      isGuestOrder: !req.user,
      items: cleanItems,
      shipping: {
        name: String(shipping.name),
        email: String(shipping.email),
        phone: shipping.phone ? String(shipping.phone) : '',
        line1: String(shipping.line1),
        line2: shipping.line2 ? String(shipping.line2) : '',
        city: String(shipping.city),
        state: shipping.state ? String(shipping.state) : '',
        postalCode: shipping.postalCode ? String(shipping.postalCode) : '',
        country: String(shipping.country)
      },
      subtotal,
      shippingFee,
      total,
      paymentMethod: paymentMethodClean,
      paymentMobileNumber: paymentMobileNumber ? String(paymentMobileNumber) : null,
      transactionId: transactionId ? String(transactionId).toUpperCase() : null
    };

    // Retry a couple of times in the astronomically unlikely event the
    // generated order number collides with an existing one.
    let order = null;
    let lastErr = null;
    for (let attempt = 0; attempt < 3 && !order; attempt++) {
      try {
        order = await Order.create({ ...orderData, orderNumber: generateOrderNumber() });
      } catch (err) {
        lastErr = err;
        if (err.code !== 11000) throw err; // not a duplicate-key error, don't retry
      }
    }
    if (!order) throw lastErr || new Error('Could not generate a unique order number.');

    res.status(201).json({ order });
  } catch (err) {
    console.error('[orders] createOrder() failed:', err.message);
    next(err);
  }
}

// GET /api/orders  (requireAuth — must be logged in to list "my orders")
async function myOrders(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    if (!isDbReady()) {
      console.warn('[orders] DB not connected — returning empty order list.');
      return res.json({ items: [], total: 0, page, pages: 0, dbOffline: true });
    }

    const filter = { user: req.user._id };
    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[orders] myOrders() failed, returning empty list:', err.message);
    res.json({ items: [], total: 0, page: 1, pages: 0, dbOffline: true });
  }
}

// GET /api/orders/:orderNumber  (optionalAuth — guests verify via ?email=)
// - Logged-in owner of the order: always allowed.
// - Guest order: allowed if the ?email= query matches the shipping email.
// - Anyone else: 403/404 as appropriate, without leaking which case it was.
async function getOrder(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Order details are temporarily unavailable (database offline). Please try again shortly.' });
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (order.user) {
      const isOwner = req.user && String(order.user) === String(req.user._id);
      if (!isOwner) return res.status(403).json({ error: 'You do not have access to this order.' });
    } else {
      const email = (req.query.email || '').trim().toLowerCase();
      if (!email || email !== order.shipping.email.toLowerCase()) {
        return res.status(403).json({ error: 'Provide the email used at checkout (?email=) to view this guest order.' });
      }
    }

    res.json({ order });
  } catch (err) {
    console.error('[orders] getOrder() failed:', err.message);
    res.status(503).json({ error: 'Order details are temporarily unavailable (database offline). Please try again shortly.' });
  }
}

// PATCH /api/orders/:orderNumber/cancel  (requireAuth — customer cancels their own order)
// Only allowed while the order is still 'pending' or 'confirmed' — once it's
// 'shipped' or 'delivered' it's too late to cancel this way (they'd need to
// contact support / return it instead), and it can't be cancelled twice.
async function cancelOrder(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot cancel your order right now — database is offline. Please try again shortly.' });
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const isOwner = order.user && String(order.user) === String(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ error: 'You do not have access to this order.' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'This order is already cancelled.' });
    }
    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ error: `This order has already been ${order.status} and can no longer be cancelled here. Please contact support.` });
    }

    order.status = 'cancelled';
    await order.save();

    // Notify the customer and the shop owner over WhatsApp. Neither of
    // these ever throws (whatsapp.js swallows its own errors), and we
    // don't await them so a slow/offline WhatsApp session never delays
    // the cancellation response to the customer.
    const customerNumber = normalizePhoneForWhatsApp(order.shipping.phone);
    sendWhatsAppMessageTo(
      customerNumber,
      `Hi ${order.shipping.name}, your Smart Choice 3D order #${order.orderNumber} has been cancelled as requested. If this wasn't you, please contact us right away.`
    ).catch(() => {});
    sendWhatsAppMessage(
      `❌ Order #${order.orderNumber} was cancelled by the customer (${order.shipping.name}, ${order.shipping.phone || 'no phone on file'}).`
    ).catch(() => {});

    res.json({ order });
  } catch (err) {
    console.error('[orders] cancelOrder() failed:', err.message);
    next(err);
  }
}

module.exports = { createOrder, myOrders, getOrder, cancelOrder };
