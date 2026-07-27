// utils/orderReceiptEmail.js
// Builds and sends a customer-facing order receipt email after an order is placed.

const { getTransporter, escapeHtml } = require('./mailer');

const STORE_NAME = 'Smart Choice 3D';
const FROM_LABEL = `"${STORE_NAME}" <${process.env.EMAIL_USER}>`;

function money(n) {
  return '$' + Number(n || 0).toFixed(2);
}

function paymentLabel(method) {
  switch (method) {
    case 'card': return 'Card';
    case 'jazzcash': return 'JazzCash';
    case 'easypaisa': return 'Easypaisa';
    default: return 'Cash on Delivery';
  }
}

function buildReceiptHTML(order) {
  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #eee">${escapeHtml(i.name)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right">${money(i.price)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right">${money(i.price * i.qty)}</td>
    </tr>
  `).join('');

  const s = order.shipping || {};

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1830">
    <div style="background:#141228;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:.5px">${STORE_NAME}</h1>
    </div>

    <div style="padding:28px 24px">
      <h2 style="margin:0 0 4px;font-size:18px">Thanks for your order, ${escapeHtml(s.name || 'there')}! 🎉</h2>
      <p style="color:#6b6886;margin:0 0 22px;font-size:14px">
        Here's your receipt for order <b>#${escapeHtml(order.orderNumber)}</b>.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
        <thead>
          <tr style="background:#f7f6fc">
            <th style="padding:10px 8px;text-align:left">Item</th>
            <th style="padding:10px 8px;text-align:center">Qty</th>
            <th style="padding:10px 8px;text-align:right">Price</th>
            <th style="padding:10px 8px;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:24px">
        <tr>
          <td style="padding:4px 8px;color:#6b6886">Subtotal</td>
          <td style="padding:4px 8px;text-align:right">${money(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;color:#6b6886">Shipping</td>
          <td style="padding:4px 8px;text-align:right">${order.shippingFee ? money(order.shippingFee) : 'Free'}</td>
        </tr>
        <tr>
          <td style="padding:8px 8px;font-weight:700;border-top:2px solid #141228">Total</td>
          <td style="padding:8px 8px;text-align:right;font-weight:700;border-top:2px solid #141228">${money(order.total)}</td>
        </tr>
      </table>

      <div style="background:#f7f6fc;border-radius:10px;padding:16px 18px;font-size:13px;line-height:1.6;margin-bottom:20px">
        <b>Shipping to:</b><br>
        ${escapeHtml(s.name || '')}<br>
        ${escapeHtml(s.line1 || '')}<br>
        ${escapeHtml(s.city || '')}${s.country ? ', ' + escapeHtml(s.country) : ''}<br>
        ${s.email ? escapeHtml(s.email) + '<br>' : ''}
      </div>

      <p style="font-size:13px;color:#6b6886;margin:0">
        Payment method: <b>${paymentLabel(order.paymentMethod)}</b>${order.transactionId ? ` <span style="color:#9b98b0">(Ref: ${escapeHtml(order.transactionId)})</span>` : ''}
      </p>

      <p style="font-size:12px;color:#9b98b0;margin-top:28px">
        Questions about your order? Just reply to this email or visit our
        <a href="#" style="color:#6c5ce7">Help Center</a>.
      </p>
    </div>

    <div style="background:#f7f6fc;padding:16px;text-align:center;font-size:12px;color:#9b98b0">
      © 2026 ${STORE_NAME}. All rights reserved.
    </div>
  </div>`;
}

// Sends the receipt. Never throws — logs and resolves so a mail hiccup
// never breaks order placement (same pattern used for WhatsApp notifications).
async function sendOrderReceiptEmail(order) {
  try {
    const to = order.shipping && order.shipping.email;
    if (!to) {
      console.error('[order] No shipping email on order, skipping receipt email.');
      return;
    }

    const mailer = getTransporter();
    if (!mailer) {
      console.error('[order] Email not configured (EMAIL_USER/EMAIL_PASS) — skipping receipt email.');
      return;
    }

    const info = await mailer.sendMail({
      from: FROM_LABEL,
      to,
      subject: `Your ${STORE_NAME} order #${order.orderNumber} is confirmed`,
      html: buildReceiptHTML(order)
    });

    console.log('[order] Receipt email sent:', info.messageId, '→', to);
  } catch (err) {
    console.error('[order] Could not send receipt email (order still placed fine):', err.message);
  }
}

module.exports = { sendOrderReceiptEmail };
