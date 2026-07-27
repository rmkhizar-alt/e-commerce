// utils/paymentGateways.js
//
// Handles JazzCash and Easypaisa "payment processing" for an order.
//
// DEMO MODE (current state):
//   No real money moves. Every JazzCash/Easypaisa payment is instantly
//   marked successful with a fake transaction ID, so checkout works fully
//   end-to-end for a demo — exactly like Cash on Delivery, just labeled
//   correctly as JazzCash/Easypaisa.
//
// GOING LIVE LATER (when you're ready to use your real Merchant ID /
// Password / Integrity Salt):
//   1. Set PAYMENT_DEMO_MODE=false in your .env
//   2. Fill in JAZZCASH_MERCHANT_ID / JAZZCASH_PASSWORD / JAZZCASH_SALT
//      (and the Easypaisa equivalents) in .env
//   3. Replace the body of callJazzCashAPI() / callEasypaisaAPI() below
//      with the real API call (endpoints + hash generation are outlined
//      in comments right there) — nothing else in the app needs to change,
//      since orderController.js only ever calls processPayment().

const crypto = require('crypto');

const DEMO_MODE = (process.env.PAYMENT_DEMO_MODE || 'true').toLowerCase() !== 'false';

function generateTxnRef(prefix) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

// ------------------------------------------------------------------
// JazzCash
// ------------------------------------------------------------------
// Real integration reference (JazzCash Mobile Account / Card sandbox):
//   Endpoint: https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction
//   Required fields include pp_MerchantID, pp_Password, pp_Amount (in paisas,
//   i.e. Rs. x 100), pp_TxnRefNo, pp_TxnDateTime, pp_BillReference, etc.
//   pp_SecureHash is an HMAC-SHA256 hash of the sorted field values using
//   JAZZCASH_SALT as the key — JazzCash's integration docs give the exact
//   field order. You'd POST that payload and check pp_ResponseCode === '000'
//   for success.
async function callJazzCashAPI(order) {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID;
  const password = process.env.JAZZCASH_PASSWORD;
  const salt = process.env.JAZZCASH_SALT;

  if (!merchantId || !password || !salt) {
    throw new Error('JazzCash credentials not set in .env (JAZZCASH_MERCHANT_ID / JAZZCASH_PASSWORD / JAZZCASH_SALT).');
  }

  // TODO (when going live): build the real pp_* payload here, compute
  // pp_SecureHash with crypto.createHmac('sha256', salt), and POST it to
  // the JazzCash sandbox/production endpoint with fetch/axios. Return
  // { success: true, transactionId: pp_TxnRefNo } on pp_ResponseCode === '000',
  // otherwise { success: false, error: pp_ResponseMessage }.
  throw new Error('Real JazzCash integration not implemented yet — set PAYMENT_DEMO_MODE=true to use the simulated flow.');
}

// ------------------------------------------------------------------
// Easypaisa
// ------------------------------------------------------------------
// Real integration reference (Easypaisa Open API / MA sandbox):
//   Endpoint: https://easypay.easypaisa.com.pk/easypay/Index.jsf (or the
//   REST OpenAPI variant, depending on which integration Easypaisa gave you).
//   Required fields include storeId, amount, postBackURL, orderRefNum,
//   autoRedirect, and a hash — Easypaisa's docs specify the exact fields
//   and hashing method for your integration type.
async function callEasypaisaAPI(order) {
  const storeId = process.env.EASYPAISA_STORE_ID;
  const hashKey = process.env.EASYPAISA_HASH_KEY;

  if (!storeId || !hashKey) {
    throw new Error('Easypaisa credentials not set in .env (EASYPAISA_STORE_ID / EASYPAISA_HASH_KEY).');
  }

  // TODO (when going live): build the real request payload here, compute
  // the required hash, and POST/redirect to Easypaisa's endpoint per your
  // integration type. Return { success: true, transactionId: orderRefNum }
  // on success, otherwise { success: false, error: '...' }.
  throw new Error('Real Easypaisa integration not implemented yet — set PAYMENT_DEMO_MODE=true to use the simulated flow.');
}

// ------------------------------------------------------------------
// Public entry point — this is the only function the rest of the app calls.
// ------------------------------------------------------------------
// order: { orderNumber, total, ... } — enough info to build a real gateway
// request later; unused for now in demo mode.
async function processPayment(method, order) {
  if (method !== 'jazzcash' && method !== 'easypaisa') {
    throw new Error(`processPayment() called with unsupported method: ${method}`);
  }

  if (DEMO_MODE) {
    // Simulated instant success — no real money moves.
    const prefix = method === 'jazzcash' ? 'JC-DEMO' : 'EP-DEMO';
    return {
      success: true,
      demo: true,
      transactionId: generateTxnRef(prefix),
      message: `${method === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} payment simulated successfully (demo mode).`
    };
  }

  try {
    const result = method === 'jazzcash'
      ? await callJazzCashAPI(order)
      : await callEasypaisaAPI(order);
    return { ...result, demo: false };
  } catch (err) {
    return { success: false, demo: false, error: err.message };
  }
}

module.exports = { processPayment, DEMO_MODE };
