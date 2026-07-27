const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const TO_EMAIL = process.env.TO_EMAIL || 'rmkhizar@gmail.com';

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

// POST /api/contact
async function create(req, res, next) {
  try {
    const { name, email, subject, message, topic, phone, order_number, rating } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ success: false, error: 'Name is required.' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email is required.' });
    }
    if (!subject || !subject.trim()) return res.status(400).json({ success: false, error: 'Subject is required.' });
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    // 1) Save to MongoDB — same as before, so nothing that already worked breaks.
    const entry = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      topic: topic || 'General'
    });

    // 2) Also email the message — this is the part that was missing before.
    const mailer = getTransporter();
    if (!mailer) {
      console.error('[contact] Email not configured: set EMAIL_USER and EMAIL_PASS in .env');
      // The message is still safely saved in the database even if email isn't
      // configured yet, so we don't fail the whole request over this.
      return res.status(201).json({
        success: true,
        id: entry._id,
        message: 'Message saved, but email is not configured on the server yet.'
      });
    }

    const attachments = (req.files || []).map((f) => ({
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
      ${attachments.length ? `<p><b>Attachments:</b> ${attachments.map((a) => escapeHtml(a.filename)).join(', ')}</p>` : ''}
    `;

    try {
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
    } catch (mailErr) {
      // The DB entry is already saved — don't fail the whole request just
      // because the email step had a problem, but log it clearly.
      console.error('[contact] Email sending failed (message was still saved to DB):', mailErr.message);
      return res.status(201).json({
        success: true,
        id: entry._id,
        message: 'Message saved, but the email could not be sent. Check server logs.'
      });
    }

    res.status(201).json({ success: true, id: entry._id, message: 'Message sent successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create };
