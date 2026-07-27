// utils/payments.js
// Real integrations for JazzCash (Mobile Wallet) and Easypaisa (Mobile Account) -
// Pakistan's two main mobile wallet payment gateways.
//
// SETUP: sign up for a sandbox/merchant account with each provider, then add
// these to your .env:
//   JAZZCASH_MERCHANT_ID=...
//   JAZZCASH_PASSWORD=...
//   JAZZCASH_INTEGRITY_SALT=...
//   EASYPAISA_STORE_ID=...
//   EASYPAISA_HASH_KEY=...
//
// IMPORTANT - please read: this was built against each provider's publicly
// documented API shape (JazzCash Mobile Wallet / Easypaisa Mobile Account),
// but has NOT been tested against a live sandbox, since no credentials were
// available while writing this. Once you get real sandbox credentials:
//   1. Add them to .env
//   2. Try a small test transaction (JazzCash/Easypaisa sandboxes give you
//      test mobile numbers/OTPs for this)
//   3. Check the raw response (logged to the console) against each
//      provider's latest integration guide if anything looks off - exact
//      hash field ordering occasionally changes on their side.
// Both functions never throw past this file for network-level problems -
// they return { success:false, message } instead, so checkout always shows
// the customer a clean error instead of a server crash.

const crypto = require('crypto');

function pad(n) { return String(n).padStart(2, '0'); }

function jazzCashDateTime(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// ---------------- JazzCash Mobile Wallet ----------------
// amount in PKR (e.g. 1500.00), mobileNumber like "03001234567",
// cnicLast6 = last 6 digits of the customer's CNIC (JazzCash requires this
// for mobile wallet transactions as an extra verification step).
async function payWithJazzCash({ amount, mobileNumber, cnicLast6, billReference, description }) {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID;
  const password = process.env.JAZZCASH_PASSWORD;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;

  if (!merchantId || !password || !integritySalt) {
    return { success: false, message: 'JazzCash is not configured yet. Add JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, and JAZZCASH_INTEGRITY_SALT to the backend .env file.' };
  }

  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour to complete
    const txnRefNo = 'T' + now.getTime();

    const params = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: String(Math.round(amount * 100)), // JazzCash wants paisas (amount x 100)
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: jazzCashDateTime(now),
      pp_BillReference: billReference,
      pp_Description: description,
      pp_TxnExpiryDateTime: jazzCashDateTime(expiry),
      pp_MobileNumber: mobileNumber,
      pp_CNIC: cnicLast6
    };

    // JazzCash requires an HMAC-SHA256 over all pp_ fields, sorted
    // alphabetically by key, joined with '&', with the integrity salt
    // prepended - then hashed using the same salt as the HMAC key.
    const sortedKeys = Object.keys(params).sort();
    const hashString = integritySalt + '&' + sortedKeys.map((k) => params[k]).join('&');
    const secureHash = crypto.createHmac('sha256', integritySalt).update(hashString).digest('hex').toUpperCase();

    const body = { ...params, pp_SecureHash: secureHash };
    const url = process.env.JAZZCASH_API_URL || 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction';

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    console.log('[jazzcash] Raw response:', data);

    const success = data.pp_ResponseCode === '000';
    return {
      success,
      message: data.pp_ResponseMessage || (success ? 'Payment successful.' : 'Payment failed.'),
      transactionId: data.pp_RetreivalReferenceNo || txnRefNo
    };
  } catch (err) {
    console.error('[jazzcash] Request failed:', err.message);
    return { success: false, message: 'Could not reach JazzCash right now. Please try again or choose another payment method.' };
  }
}

// ---------------- Easypaisa Mobile Account ----------------
// amount in PKR, mobileNumber like "03001234567"
async function payWithEasypaisa({ amount, mobileNumber, email, orderRefNo }) {
  const storeId = process.env.EASYPAISA_STORE_ID;
  const hashKey = process.env.EASYPAISA_HASH_KEY;

  if (!storeId || !hashKey) {
    return { success: false, message: 'Easypaisa is not configured yet. Add EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY to the backend .env file.' };
  }

  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + 60 * 60 * 1000);
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    const payload = {
      storeId,
      amount: amount.toFixed(2),
      postBackURL: process.env.EASYPAISA_POSTBACK_URL || 'http://localhost:4000/api/orders/easypaisa-callback',
      orderRefNum: orderRefNo,
      expiryDate: fmt(expiry),
      autoRedirect: '0',
      paymentMethod: 'MA',
      mobileAccountNo: mobileNumber,
      emailAddress: email || 'customer@example.com',
      transactionDateTime: fmt(now)
    };

    // Easypaisa expects an HMAC-SHA256 of the sorted key=value pairs using
    // the merchant hash key - double check exact field list/order against
    // the latest Easypaisa Mobile Account integration guide with real creds.
    const toHash = Object.keys(payload).sort().map((k) => `${k}=${payload[k]}`).join('&');
    const merchantHashedReq = crypto.createHmac('sha256', hashKey).update(toHash).digest('base64');

    const url = process.env.EASYPAISA_API_URL || 'https://easypaystagingapi.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction';

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, merchantHashedReq })
    });
    const data = await resp.json();
    console.log('[easypaisa] Raw response:', data);

    const success = data.responseCode === '0000' || data.responseCode === 0;
    return {
      success,
      message: data.responseDesc || data.msg || (success ? 'Payment successful.' : 'Payment failed.'),
      transactionId: data.transactionId || orderRefNo
    };
  } catch (err) {
    console.error('[easypaisa] Request failed:', err.message);
    return { success: false, message: 'Could not reach Easypaisa right now. Please try again or choose another payment method.' };
  }
}

module.exports = { payWithJazzCash, payWithEasypaisa };
