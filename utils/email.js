const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // Not configured - caller should handle this gracefully
  }
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return cachedTransporter;
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const transporter = getTransporter();
  if (!transporter) {
    // SMTP isn't configured - log it so the developer can still test the flow locally
    console.log(`[email] SMTP not configured. Reset link for ${toEmail}: ${resetUrl}`);
    return { sent: false, reason: 'SMTP not configured' };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Reset your Smart Choice 3D password',
    html: `
      <p>We received a request to reset your Smart Choice 3D password.</p>
      <p><a href="${resetUrl}">Click here to choose a new password</a> (this link expires in 1 hour).</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `
  });
  return { sent: true };
}

module.exports = { sendPasswordResetEmail, getTransporter };
