const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const DeliveryBoy = require('../models/DeliveryBoy');
const { isDbReady } = require('../config/db');
const { sendWhatsAppMessageTo, sendWhatsAppMessage } = require('../utils/whatsapp');

function normalizePhoneForWhatsApp(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = '92' + digits.slice(1);
  return digits;
}

// Shapes an order the same way the delivery app needs it — just the fields
// a rider actually uses, with the customer's shipping info front and center.
function shapeOrderForDelivery(o) {
  const obj = o.toObject ? o.toObject() : o;
  return {
    _id: String(obj._id),
    orderNumber: obj.orderNumber,
    status: obj.status,
    deliveryStatus: obj.deliveryStatus,
    total: obj.total,
    paymentMethod: obj.paymentMethod,
    items: (obj.items || []).map((i) => ({ name: i.name, qty: i.qty })),
    customer: {
      name: obj.shipping.name,
      phone: obj.shipping.phone,
      address: [obj.shipping.line1, obj.shipping.line2].filter(Boolean).join(', '),
      city: obj.shipping.city,
      postalCode: obj.shipping.postalCode
    },
    deliveryLocation: obj.deliveryLocation,
    deliveryOtp: obj.deliveryOtp?.code ? { generatedAt: obj.deliveryOtp.generatedAt } : null // never leak the code itself in list/detail responses used for display
  };
}

// ---------------------------------------------------------
// POST /api/delivery/login   Body: { email, password }
// ---------------------------------------------------------
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot log in right now — database is offline.' });
    }

    const deliveryBoy = await DeliveryBoy.findOne({ email: email.toLowerCase().trim() });
    if (!deliveryBoy || !deliveryBoy.isActive) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, deliveryBoy.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ sub: deliveryBoy._id.toString(), role: 'delivery' }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({ token, deliveryBoy: deliveryBoy.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// GET /api/delivery/orders  (only this rider's active assignments)
// ---------------------------------------------------------
async function getMyOrders(req, res, next) {
  try {
    if (!isDbReady()) return res.json({ orders: [] });

    const orders = await Order.find({
      assignedDeliveryBoy: req.deliveryBoy._id,
      deliveryStatus: { $in: ['assigned', 'out_for_delivery'] }
    }).sort({ createdAt: -1 });

    res.json({ orders: orders.map(shapeOrderForDelivery) });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// GET /api/delivery/orders/:id
// ---------------------------------------------------------
async function getOrderDetail(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, assignedDeliveryBoy: req.deliveryBoy._id });
    if (!order) return res.status(404).json({ error: 'Order not found or not assigned to you.' });
    res.json({ order: shapeOrderForDelivery(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// PUT /api/delivery/orders/:id/start   Body: { lat, lng }
// ---------------------------------------------------------
async function startDelivery(req, res, next) {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedDeliveryBoy: req.deliveryBoy._id },
      { deliveryStatus: 'out_for_delivery', 'deliveryProof.deliveryBoyLat': lat, 'deliveryProof.deliveryBoyLng': lng },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found or not assigned to you.' });
    res.json({ order: shapeOrderForDelivery(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// PUT /api/delivery/orders/:id/generate-otp
// ---------------------------------------------------------
async function generateOtp(req, res, next) {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedDeliveryBoy: req.deliveryBoy._id },
      { deliveryOtp: { code: otp, generatedAt: new Date() } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found or not assigned to you.' });

    // Send the OTP to the customer over WhatsApp (never awaited — see the
    // rest of the codebase's pattern in orderController.js/adminController.js).
    const customerNumber = normalizePhoneForWhatsApp(order.shipping.phone);
    sendWhatsAppMessageTo(
      customerNumber,
      `Your Smart Choice 3D delivery code for order #${order.orderNumber} is: ${otp}. Share this with the rider only once you receive your order.`
    ).catch(() => {});

    res.json({ message: 'OTP sent to customer.' });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// PUT /api/delivery/orders/:id/deliver   Body: { lat, lng, otp, notes }
// ---------------------------------------------------------
async function confirmDelivery(req, res, next) {
  try {
    const { lat, lng, otp, notes } = req.body;

    const order = await Order.findOne({ _id: req.params.id, assignedDeliveryBoy: req.deliveryBoy._id });
    if (!order) return res.status(404).json({ error: 'Order not found or not assigned to you.' });

    if (order.deliveryOtp && order.deliveryOtp.code) {
      if (String(otp) !== String(order.deliveryOtp.code)) {
        return res.status(400).json({ error: 'Incorrect OTP.' });
      }
    }

    order.status = 'delivered';
    order.deliveryStatus = 'delivered';
    order.deliveryProof = {
      deliveredAt: new Date(),
      deliveryBoyLat: lat,
      deliveryBoyLng: lng,
      otpVerified: true,
      notes: notes || ''
    };
    await order.save();

    const customerNumber = normalizePhoneForWhatsApp(order.shipping.phone);
    sendWhatsAppMessageTo(
      customerNumber,
      `Hi ${order.shipping.name}, your Smart Choice 3D order #${order.orderNumber} has been delivered. Thank you for shopping with us!`
    ).catch(() => {});
    sendWhatsAppMessage(`✅ Order #${order.orderNumber} was marked delivered by ${req.deliveryBoy.name}.`).catch(() => {});

    res.json({ order: shapeOrderForDelivery(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------
// PUT /api/delivery/location   Body: { lat, lng }  (periodic live location ping)
// ---------------------------------------------------------
async function updateLocation(req, res, next) {
  try {
    const { lat, lng } = req.body;
    await DeliveryBoy.findByIdAndUpdate(req.deliveryBoy._id, {
      currentLocation: { lat, lng, updatedAt: new Date() }
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getMyOrders,
  getOrderDetail,
  startDelivery,
  generateOtp,
  confirmDelivery,
  updateLocation
};
