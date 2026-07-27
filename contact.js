// routes/contact.js
// Handles the Smart Choice 3D contact form (including file attachments)
// and emails it via Nodemailer to TO_EMAIL (rmkhizar@gmail.com by default).
//
// Setup:
//   1. npm install nodemailer multer   (if not already installed)
//   2. Set EMAIL_USER / EMAIL_PASS (and optionally SMTP_HOST/SMTP_PORT, TO_EMAIL)
//      in your project's .env file — same one used by the main server.js.
//   3. This router is mounted automatically by server.js at /api/contact
//      (so the endpoint becomes POST /api/contact).

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const router = express.Router();

const TO_EMAIL = process.env.TO_EMAIL || 'rmkhizar@gmail.com';

// Attachments are kept in memory (never written to disk) and capped at
// 5MB per file, 5 files max, matching the limits enforced on the frontend.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      })
    : nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
  return transporter;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// GET /api/contact/health  -> lets you quickly check if email is configured
router.get('/health', (req, res) => {
  res.json({ ok: true, mailConfigured: !!getTransporter() });
});

// POST /api/contact  -> submit the contact form (multipart/form-data)
router.post('/', upload.array('attachment', 5), async (req, res) => {
  try {
    const { name, email, subject, message, phone, order_number, topic, rating } = req.body;

    // Server-side validation — never trust the client alone.
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ success: false, error: 'A valid email is required.' });
    }
    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ success: false, error: 'Subject is required.' });
    }
    if (!message || String(message).trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    const mailer = getTransporter();
    if (!mailer) {
      console.error('Email not configured: set EMAIL_USER and EMAIL_PASS in .env');
      return res.status(500).json({ success: false, error: 'Email is not configured on the server yet.' });
    }

    const attachments = (req.files || []).map(f => ({
      filename: f.originalname,
      content: f.buffer
    }));

    const html = `
      <h2>New Smart Choice 3D contact message</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Phone:</b> ${escapeHtml(phone || 'Not provided')}</p>
      <p><b>Order #:</b> ${escapeHtml(order_number || 'Not provided')}</p>
      <p><b>Topic:</b> ${escapeHtml(topic || 'General')}</p>
      <p><b>Rating:</b> ${escapeHtml(rating || 'Not rated')}</p>
      <p><b>Subject:</b> ${escapeHtml(subject)}</p>
      <p><b>Message:</b></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      ${attachments.length ? `<p><b>Attachments:</b> ${attachments.map(a => escapeHtml(a.filename)).join(', ')}</p>` : ''}
    `;

    const info = await mailer.sendMail({
      from: `"Smart Choice 3D Contact Form" <${process.env.EMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Smart Choice 3D Contact — ${subject}`,
      html,
      attachments
    });

    // TEMPORARY DEBUG LOGGING — remove once email delivery is confirmed working.
    console.log('[contact] sendMail() finished. Details from Gmail:');
    console.log('  messageId:', info.messageId);
    console.log('  accepted:', info.accepted);
    console.log('  rejected:', info.rejected);
    console.log('  response:', info.response);

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'One of your files is over the 5MB limit.' });
    }
    res.status(500).json({ success: false, error: 'Could not send your message. Please try again.' });
  }
});

module.exports = router;
