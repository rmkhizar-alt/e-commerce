/* ==========================================================================
   newsletter-backend.js
   Smart Choice 3D — Newsletter Subscribe + New-Product Notification Backend
   ==========================================================================
   Yeh EK FILE hai jo sari website (index.html + har category page + admin)
   ke footer "Subscribe" form ko backend se jorti hai.

   Kaam:
   1) POST /api/newsletter/subscribe   -> email save karta hai (subscribers.json)
   2) POST /api/newsletter/unsubscribe -> email remove karta hai
   3) notifyNewProduct(product)        -> jab admin naya product add kare,
                                           yeh function call karo. Yeh sab
                                           subscribers ko EMAIL bhejega aur
                                           ek in-site NOTIFICATION bhi save
                                           karega (bell icon ke liye).
   4) GET  /api/notifications?email=x  -> us email ke liye saved notifications
   5) POST /api/notifications/read     -> notifications ko "read" mark karo

   Kahan lagana hai:
   - Is file ko project ke root me rakho (jahan server.js hai).
   - server.js me sirf 2 lines add karo (neeche "SERVER.JS ME ADD KARO" dekho).
   - Jahan bhi naya product add hota hai (admin.js / admin route/controller),
     wahan product save hone ke baad ek line likho:
         const { notifyNewProduct } = require('./newsletter-backend');
         notifyNewProduct(newProduct);

   .env me yeh add karo (Gmail example — apne SMTP ke mutabiq badal sakte ho):
     EMAIL_SERVICE=gmail
     EMAIL_USER=youremail@gmail.com
     EMAIL_PASS=your_app_password        (Gmail "App Password", normal password nahi)
     SITE_URL=http://localhost:3000      (ya jo bhi live domain hai)
     SITE_NAME=Smart Choice 3D

   Install (agar pehle se nahi hai):
     npm install nodemailer express
   ========================================================================== */

const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();

/* ---------- Data files (koi database change nahi, simple JSON files) ---------- */
const DATA_DIR = path.join(__dirname, 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SUBSCRIBERS_FILE)) fs.writeFileSync(SUBSCRIBERS_FILE, '[]', 'utf8');
  if (!fs.existsSync(NOTIFICATIONS_FILE)) fs.writeFileSync(NOTIFICATIONS_FILE, '[]', 'utf8');
}
ensureDataFiles();

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

/* ---------- Email setup (nodemailer) ---------- */
function getTransporter() {
  // Gmail use karna asaan hai, lekin koi bhi SMTP chal jayega.
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

const SITE_NAME = process.env.SITE_NAME || 'Smart Choice 3D';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/* ==========================================================================
   ROUTES
   ========================================================================== */

// 1) Subscribe — footer/hero form is se connect hoga
router.post('/subscribe', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const subscribers = readJSON(SUBSCRIBERS_FILE);
  const already = subscribers.find((s) => s.email === email);

  if (already) {
    return res.json({ success: true, message: 'You are already subscribed!' });
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  writeJSON(SUBSCRIBERS_FILE, subscribers);

  // Respond to the browser immediately — don't make the user wait for the
  // welcome email to send before they see a success message.
  res.json({ success: true, message: 'Subscribed! Watch your inbox for deals.' });

  // Send a welcome/confirmation email in the background. If this fails
  // (bad email credentials, offline, etc.) it's only logged — the
  // subscription itself has already succeeded.
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${SITE_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to ${SITE_NAME}!`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
          <h2 style="margin-bottom:4px;">${SITE_NAME}</h2>
          <p style="color:#333;font-size:15px;">Thank you for subscribing to our newsletter!</p>
          <p style="color:#555;font-size:14px;line-height:1.6;">
            You have successfully subscribed to updates from ${SITE_NAME}.
            From now on, we'll email you whenever a new product drops, along with
            the latest deals and offers — so you never miss out.
          </p>
          <a href="${SITE_URL}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:12px;">Visit ${SITE_NAME}</a>
          <p style="color:#999;font-size:12px;margin-top:24px;">
            If you did not sign up for this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`[newsletter] Welcome email to ${email} failed:`, err.message);
  }
});

// 2) Unsubscribe (email footer me "unsubscribe" link ke liye, optional)
router.post('/unsubscribe', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  let subscribers = readJSON(SUBSCRIBERS_FILE);
  const before = subscribers.length;
  subscribers = subscribers.filter((s) => s.email !== email);
  writeJSON(SUBSCRIBERS_FILE, subscribers);
  return res.json({ success: true, removed: before !== subscribers.length });
});

// 3) Notifications for a logged-in user's email (bell icon ke liye - optional use)
router.get('/notifications', (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'email query required' });

  const all = readJSON(NOTIFICATIONS_FILE);
  const mine = all.filter((n) => n.email === email);
  return res.json({ success: true, notifications: mine });
});

// 4) Mark notifications read
router.post('/notifications/read', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const all = readJSON(NOTIFICATIONS_FILE);
  all.forEach((n) => {
    if (n.email === email) n.read = true;
  });
  writeJSON(NOTIFICATIONS_FILE, all);
  return res.json({ success: true });
});

/* ==========================================================================
   CORE FEATURE: naya product add hone par sab subscribers ko batana
   ==========================================================================
   Product object me kam se kam yeh fields hone chahiye (jo bhi milen use kar lega):
     { id, name, price, image, url }
   Agar url na ho to product.html?id=... khud bana lega.
   ========================================================================== */
async function notifyNewProduct(product) {
  const subscribers = readJSON(SUBSCRIBERS_FILE);
  if (!subscribers.length) return { sent: 0 };

  const productName = product?.name || 'A new product';
  const productImage = product?.image || '';
  const productPrice = product?.price ? `PKR ${product.price}` : '';
  const productUrl = product?.url || `${SITE_URL}/product.html?id=${product?.id || ''}`;

  // ---- (a) In-site notifications save karo (sab subscribers ke liye) ----
  const notifications = readJSON(NOTIFICATIONS_FILE);
  const now = new Date().toISOString();
  subscribers.forEach((sub) => {
    notifications.push({
      email: sub.email,
      title: 'New product added',
      message: `${productName} is now available on ${SITE_NAME}.`,
      productId: product?.id || null,
      url: productUrl,
      read: false,
      createdAt: now,
    });
  });
  writeJSON(NOTIFICATIONS_FILE, notifications);

  // ---- (b) Email bhejo sab subscribers ko ----
  let sent = 0;
  let transporter;
  try {
    transporter = getTransporter();
  } catch (e) {
    console.error('Email transporter setup failed:', e.message);
    return { sent };
  }

  for (const sub of subscribers) {
    try {
      await transporter.sendMail({
        from: `"${SITE_NAME}" <${process.env.EMAIL_USER}>`,
        to: sub.email,
        subject: `New drop on ${SITE_NAME}: ${productName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
            <h2 style="margin-bottom:4px;">${SITE_NAME}</h2>
            <p style="color:#555;">A new product just landed:</p>
            ${productImage ? `<img src="${productImage}" alt="${productName}" style="width:100%;max-width:400px;border-radius:8px;margin:12px 0;">` : ''}
            <h3 style="margin:8px 0;">${productName}</h3>
            ${productPrice ? `<p style="font-size:18px;color:#111;font-weight:bold;">${productPrice}</p>` : ''}
            <a href="${productUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:10px;">View Product</a>
            <p style="color:#999;font-size:12px;margin-top:24px;">You are receiving this because you subscribed on ${SITE_NAME}.</p>
          </div>
        `,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to email ${sub.email}:`, err.message);
    }
  }

  return { sent, total: subscribers.length };
}

module.exports = { router, notifyNewProduct };
