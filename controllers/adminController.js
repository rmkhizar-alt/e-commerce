// controllers/adminController.js
// All routes here are protected by requireAuth + requireAdmin (see routes/admin.js).

const bcrypt = require('bcryptjs');
const Order = require('../models/Order');
const User = require('../models/User');
const Printer = require('../models/Printer');
const Filament = require('../models/Filament');
const DeliveryBoy = require('../models/DeliveryBoy');
const { sendWhatsAppMessageTo, sendWhatsAppMessage } = require('../utils/whatsapp');

// WhatsApp numbers need digits only, country code, no leading 0 and no '+'
// (e.g. "923001234567"). Checkout accepts both "03001234567" and
// "+923001234567" formats, so this normalizes either into what
// sendWhatsAppMessageTo() expects. (Same helper as controllers/orderController.js.)
function normalizePhoneForWhatsApp(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = '92' + digits.slice(1);
  return digits;
}

// What to tell the customer for each status an admin can move an order to.
// 'pending' has no message since that's the order's starting state, not
// something an admin would deliberately set someone back to.
const STATUS_MESSAGES = {
  confirmed: (o) => `Hi ${o.shipping.name}, your Smart Choice 3D order #${o.orderNumber} has been confirmed and is being prepared. We'll let you know when it ships!`,
  shipped: (o) => `Hi ${o.shipping.name}, your Smart Choice 3D order #${o.orderNumber} has shipped and is on its way to you!`,
  delivered: (o) => `Hi ${o.shipping.name}, your Smart Choice 3D order #${o.orderNumber} has been delivered. Thank you for shopping with us — enjoy!`,
  cancelled: (o) => `Hi ${o.shipping.name}, your Smart Choice 3D order #${o.orderNumber} has been cancelled by our team. Please contact support if you have any questions.`
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Shapes a real Order document into the format the Admin Panel Plus UI expects.
// This used to fill in fake "print params" (gcode/layer height/etc.) left over
// from the UI's original 3D-printing demo — replaced here with the order's
// actual retail fields plus real delivery-boy assignment/tracking info.
function shapeOrderForPanel(o) {
  const obj = o.toObject ? o.toObject() : o;
  const deliveryBoy = obj.assignedDeliveryBoy && obj.assignedDeliveryBoy.name ? obj.assignedDeliveryBoy : null;

  return {
    _id: String(obj._id),
    orderNumber: obj.orderNumber,
    isGuestOrder: obj.isGuestOrder,
    createdAt: obj.createdAt,
    status: obj.status,
    total: obj.total,
    subtotal: obj.subtotal,
    shippingFee: obj.shippingFee,
    paymentMethod: obj.paymentMethod,
    paymentStatus: obj.paymentStatus,
    items: (obj.items || []).map((it) => ({
      id: it.productId,
      name: it.name,
      qty: it.qty,
      price: it.price
    })),
    shipping: {
      name: obj.shipping.name,
      email: obj.shipping.email,
      phone: obj.shipping.phone || '',
      line1: obj.shipping.line1,
      line2: obj.shipping.line2 || '',
      city: obj.shipping.city,
      state: obj.shipping.state || '',
      postalCode: obj.shipping.postalCode || '',
      country: obj.shipping.country
    },
    deliveryStatus: obj.deliveryStatus || 'unassigned',
    deliveryBoy: deliveryBoy
      ? { _id: String(deliveryBoy._id), name: deliveryBoy.name, phone: deliveryBoy.phone }
      : null,
    deliveryLocation: obj.deliveryLocation || { lat: null, lng: null },
    deliveryProof: obj.deliveryProof || null
  };
}

// ---------------- Orders ----------------

// GET /api/admin/orders?search=&status=
async function listOrders(req, res, next) {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (search && search.trim()) {
      const re = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ orderNumber: re }, { 'shipping.name': re }, { 'shipping.email': re }];
    }

    const orders = await Order.find(query)
      .populate('assignedDeliveryBoy', 'name phone')
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ orders: orders.map(shapeOrderForPanel) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/orders/:id/status   Body: { status }
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Notify the customer over WhatsApp for any status a staff member would
    // actually choose (not awaited — whatsapp.js never throws and we don't
    // want a slow/offline WhatsApp session to delay the admin's response).
    const messageBuilder = STATUS_MESSAGES[status];
    if (messageBuilder) {
      const customerNumber = normalizePhoneForWhatsApp(order.shipping.phone);
      sendWhatsAppMessageTo(customerNumber, messageBuilder(order)).catch(() => {});
    }
    if (status === 'cancelled') {
      sendWhatsAppMessage(
        `❌ Order #${order.orderNumber} was cancelled from the admin panel (${order.shipping.name}, ${order.shipping.phone || 'no phone on file'}).`
      ).catch(() => {});
    }

    res.json({ order: shapeOrderForPanel(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------- Delivery boys ----------------

// GET /api/admin/delivery-boys
async function listDeliveryBoys(req, res, next) {
  try {
    const deliveryBoys = await DeliveryBoy.find().sort({ createdAt: -1 });
    res.json({ deliveryBoys: deliveryBoys.map((d) => d.toSafeJSON()) });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/delivery-boys   Body: { name, email, phone, password, vehicleNumber }
async function addDeliveryBoy(req, res, next) {
  try {
    const { name, email, phone, password, vehicleNumber } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'name, email, phone, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await DeliveryBoy.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'A delivery boy with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const deliveryBoy = await DeliveryBoy.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      passwordHash,
      vehicleNumber: vehicleNumber || ''
    });

    res.status(201).json({ deliveryBoy: deliveryBoy.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/delivery-boys/:id   Body: { isActive }
// Simple enable/disable toggle — admin removes access without deleting history.
async function updateDeliveryBoy(req, res, next) {
  try {
    const { isActive } = req.body;
    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!deliveryBoy) return res.status(404).json({ error: 'Delivery boy not found.' });
    res.json({ deliveryBoy: deliveryBoy.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/orders/:id/assign-delivery   Body: { deliveryBoyId }
async function assignDeliveryBoy(req, res, next) {
  try {
    const { deliveryBoyId } = req.body;
    if (!deliveryBoyId) return res.status(400).json({ error: 'deliveryBoyId is required.' });

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy || !deliveryBoy.isActive) {
      return res.status(404).json({ error: 'Delivery boy not found or inactive.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedDeliveryBoy: deliveryBoy._id, deliveryStatus: 'assigned' },
      { new: true }
    ).populate('assignedDeliveryBoy', 'name phone');
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Let the rider know over WhatsApp that a new order is waiting for them.
    const riderNumber = normalizePhoneForWhatsApp(deliveryBoy.phone);
    sendWhatsAppMessageTo(
      riderNumber,
      `New delivery assigned: Order #${order.orderNumber} — ${order.shipping.name}, ${order.shipping.city}. Open the delivery app to view full details.`
    ).catch(() => {});

    res.json({ order: shapeOrderForPanel(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------- Users ----------------

// GET /api/admin/users?search=
async function listUsers(req, res, next) {
  try {
    const { search } = req.query;
    const query = {};
    if (search && search.trim()) {
      const re = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: re }, { email: re }];
    }

    const users = await User.find(query)
      .select('-passwordHash -resetPasswordTokenHash')
      .sort({ createdAt: -1 })
      .limit(500);

    // Attach a real order count per user (small scale, so a simple loop is fine).
    const shaped = await Promise.all(
      users.map(async (u) => {
        const ordersCount = await Order.countDocuments({ user: u._id });
        return {
          _id: String(u._id),
          name: u.name,
          email: u.email,
          addresses: (u.addresses || []).map((a) => ({
            address: [a.line1, a.line2].filter(Boolean).join(', '),
            city: a.city || '',
            zip: a.postalCode || '',
            country: a.country || ''
          })),
          createdAt: u.createdAt,
          ordersCount
        };
      })
    );

    res.json({ users: shaped });
  } catch (err) {
    next(err);
  }
}

// ---------------- Printer fleet ----------------

async function listPrinters(req, res, next) {
  try {
    const printers = await Printer.find().sort({ createdAt: 1 });
    res.json({
      printers: printers.map((p) => ({
        id: String(p._id),
        name: p.name,
        type: p.type,
        status: p.status,
        currentOrderNumber: p.currentOrderNumber || undefined,
        currentJobProgress: p.currentJobProgress === null ? undefined : p.currentJobProgress,
        currentJobTimeRemaining: p.currentJobTimeRemaining === null ? undefined : p.currentJobTimeRemaining,
        bedTemperature: p.bedTemperature,
        nozzleTemperature: p.nozzleTemperature,
        materialType: p.materialType || undefined,
        materialColor: p.materialColor || undefined
      }))
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/fleet/add   Body: { name, type }
async function addPrinter(req, res, next) {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'Missing printer name or technology type.' });
    const printer = await Printer.create({ name, type, status: 'idle' });
    res.json({ success: true, printer });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/fleet/:id
async function deletePrinter(req, res, next) {
  try {
    const printer = await Printer.findByIdAndDelete(req.params.id);
    if (!printer) return res.status(404).json({ error: 'Printer not found.' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/fleet/control   Body: { printerId, action }
async function controlPrinter(req, res, next) {
  try {
    const { printerId, action } = req.body;
    const printer = await Printer.findById(printerId);
    if (!printer) return res.status(404).json({ error: 'Printer not found.' });

    if (action === 'pause' && printer.status === 'printing') {
      printer.status = 'paused';
    } else if (action === 'resume' && printer.status === 'paused') {
      printer.status = 'printing';
    } else if (action === 'abort' && ['printing', 'paused'].includes(printer.status)) {
      const orderNum = printer.currentOrderNumber;
      printer.status = 'idle';
      printer.currentOrderNumber = null;
      printer.currentJobProgress = null;
      printer.currentJobTimeRemaining = null;
      printer.bedTemperature = 0;
      printer.nozzleTemperature = 22;
      if (orderNum) {
        const order = await Order.findOne({ orderNumber: orderNum });
        if (order) {
          order.status = 'confirmed';
          order.assignedPrinterId = undefined;
          await order.save();
        }
      }
    } else if (action === 'maintenance') {
      printer.status = 'maintenance';
      printer.currentOrderNumber = null;
      printer.currentJobProgress = null;
      printer.currentJobTimeRemaining = null;
    } else if (action === 'activate' && printer.status === 'maintenance') {
      printer.status = 'idle';
    } else {
      return res.status(400).json({ error: `Action "${action}" is not valid for a printer in status "${printer.status}".` });
    }

    await printer.save();
    res.json({ success: true, printer });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/fleet/dispatch   Body: { orderId, printerId }
async function dispatchJob(req, res, next) {
  try {
    const { orderId, printerId } = req.body;
    const order = await Order.findById(orderId);
    const printer = await Printer.findById(printerId);
    if (!order || !printer) return res.status(404).json({ error: 'Order or printer not found.' });
    if (['printing', 'offline', 'maintenance'].includes(printer.status)) {
      return res.status(400).json({ error: 'Printer is not available for a job.' });
    }

    order.assignedPrinterId = String(printer._id);
    order.status = 'confirmed';
    await order.save();

    printer.status = 'printing';
    printer.currentOrderNumber = order.orderNumber;
    printer.currentJobProgress = 0;
    await printer.save();

    res.json({ success: true, printer, order: shapeOrderForPanel(order) });
  } catch (err) {
    next(err);
  }
}

// ---------------- Filament inventory ----------------

async function listFilaments(req, res, next) {
  try {
    const filaments = await Filament.find().sort({ createdAt: 1 });
    res.json({
      filaments: filaments.map((f) => ({
        id: String(f._id),
        material: f.material,
        color: f.color,
        hexColor: f.hexColor,
        remainingWeightKg: f.remainingWeightKg,
        totalWeightKg: f.totalWeightKg,
        temperatureC: f.temperatureC,
        pricePerGram: f.pricePerGram
      }))
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/inventory   Body: { material, color, hexColor, totalWeightKg, temperatureC, pricePerGram }
async function addFilament(req, res, next) {
  try {
    const { material, color, hexColor, totalWeightKg, temperatureC, pricePerGram } = req.body;
    if (!material || !color || !totalWeightKg) {
      return res.status(400).json({ error: 'material, color, and totalWeightKg are required.' });
    }
    const filament = await Filament.create({
      material,
      color,
      hexColor: hexColor || '#888888',
      totalWeightKg,
      remainingWeightKg: totalWeightKg,
      temperatureC: temperatureC || 210,
      pricePerGram: pricePerGram || 0.03
    });
    res.json({ success: true, filament });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/inventory/:id   Body: { weightToAddKg }
async function restockFilament(req, res, next) {
  try {
    const { weightToAddKg } = req.body;
    const filament = await Filament.findById(req.params.id);
    if (!filament) return res.status(404).json({ error: 'Filament roll not found.' });

    if (weightToAddKg !== undefined) {
      filament.remainingWeightKg = Math.min(
        filament.totalWeightKg,
        filament.remainingWeightKg + Number(weightToAddKg)
      );
    }
    await filament.save();
    res.json({ success: true, filament });
  } catch (err) {
    next(err);
  }
}

// ---------------- AI order insights (Groq) ----------------
// Reframed from "print analysis" (not applicable - these are retail goods) to a
// genuinely useful fulfillment/packaging insight based on the real order.
// Uses Groq's OpenAI-compatible chat completions API (fast open-weight models).

const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function analyzeOrder(req, res, next) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: 'AI insights are not configured yet. Add GROQ_API_KEY to the backend .env file.' });
    }

    const order = await Order.findById(req.body.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const itemsText = order.items.map((i) => `${i.name} x${i.qty} ($${i.price} each)`).join(', ');
    const prompt = `You are an e-commerce fulfillment assistant for "Smart Choice 3D", an online shop selling ` +
      `everyday retail products (watches, bags, shoes, etc.) with 3D previews. Given this real order, write a short, ` +
      `practical fulfillment report.\n\nOrder ${order.orderNumber}\nItems: ${itemsText}\nTotal: $${order.total}\n` +
      `Shipping to: ${order.shipping.city}, ${order.shipping.country}\n\n` +
      `Return ONLY raw JSON (no markdown) matching exactly:\n` +
      `{"packagingTip": string, "shippingRiskNote": string, "estimatedPackDurationMinutes": number, ` +
      `"recommendedBoxSize": string, "customerCareNote": string}`;

    const resp = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You always reply with a single valid JSON object and nothing else.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4
      })
    });
    const data = await resp.json();

    if (!resp.ok) {
      console.error('[admin] Groq error:', data);
      return res.status(502).json({ error: data.error?.message || 'AI insight generation failed.' });
    }

    const text = data.choices?.[0]?.message?.content || '{}';
    const report = JSON.parse(text);
    res.json({ report });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  updateOrderStatus,
  listDeliveryBoys,
  addDeliveryBoy,
  updateDeliveryBoy,
  assignDeliveryBoy,
  listUsers,
  listPrinters,
  addPrinter,
  deletePrinter,
  controlPrinter,
  dispatchJob,
  listFilaments,
  addFilament,
  restockFilament,
  analyzeOrder
};
