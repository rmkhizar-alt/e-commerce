// utils/whatsapp.js
// Sends a WhatsApp text message to the shop owner using whatsapp-web.js
// (uses your own WhatsApp account via WhatsApp Web — no third-party bot, no apikey).
//
// FIRST TIME SETUP:
//   1. Run your app / this file once.
//   2. An 8-character PAIRING CODE will print in the terminal (not a QR).
//   3. On your phone: WhatsApp > Settings > Linked Devices > Link a Device >
//      "Link with phone number instead" > type the code in.
//   4. Session is saved locally (in .wwebjs_auth folder) — you only do this once.
//
// If WhatsApp ever gets disconnected (phone offline too long, logged out from
// the phone, etc.), this automatically starts a fresh session and prints a
// brand new pairing code in the terminal - no need to restart the server or
// manually delete any session folder.
//
// Requires this in .env:
//   OWNER_WHATSAPP_NUMBER=92XXXXXXXXXX   (owner's number, country code, NO + and NO leading 0)
//
// This never throws to the caller - if it fails, it just logs and moves on,
// so a WhatsApp hiccup never breaks order creation.

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Path to your installed Chrome (avoids Puppeteer needing to download its own Chromium)
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// How long to wait before trying a fresh session after a disconnect.
const RECONNECT_DELAY_MS = 5000;

// If neither "qr" nor "ready" fires within this long after starting up,
// something is stuck (usually a stale/corrupted saved session) - we clear
// it and try again from scratch so a pairing code always eventually shows up.
const STARTUP_WATCHDOG_MS = 120000; // 2 minutes

// Safety cap so a genuinely broken environment (e.g. Chrome can't launch at
// all) logs a clear error and stops, instead of retrying forever and piling
// up orphaned Chrome processes.
const MAX_WATCHDOG_RETRIES = 4;

// Some intermittent whatsapp-web.js internal errors (e.g. "Cannot read
// properties of undefined (reading 'getChat')") happen when WhatsApp Web's
// injected page context is momentarily out of sync right after a previous
// send — usually transient. One short retry clears most of these without
// needing a full client restart.
const SEND_RETRY_DELAY_MS = 3000;

const SESSION_DIR = path.join(process.cwd(), '.wwebjs_auth');

let client = null;
let isReady = false;
let readyPromise;
let readyPromiseResolve;
let watchdogTimer = null;
let watchdogRetryCount = 0;
let initInFlight = false; // guards against overlapping initClient() calls
let pairingRequested = false; // guards against requesting a pairing code more than once per client instance

function resetReadyPromise() {
  readyPromise = new Promise((resolve) => { readyPromiseResolve = resolve; });
}
resetReadyPromise();

function clearWatchdog() {
  if (watchdogTimer) { clearTimeout(watchdogTimer); watchdogTimer = null; }
}

function clearSessionFolder() {
  try {
    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
  } catch (err) {
    console.error('[whatsapp] Could not clear old session folder:', err.message);
  }
}

// Forcefully kill the underlying Chrome process for a client, if any.
// client.destroy() sometimes resolves without the OS-level Chrome process
// actually exiting on Windows. If that zombie process keeps the profile
// folder (SESSION_DIR) locked, every subsequent attempt gets stuck too,
// which is what turns a single slow start into an endless retry loop.
async function hardKillClient(oldClient) {
  if (!oldClient) return;
  try {
    await oldClient.destroy();
  } catch (_) {}
  try {
    const proc = oldClient.pupBrowser && oldClient.pupBrowser.process
      ? oldClient.pupBrowser.process()
      : null;
    if (proc && !proc.killed) {
      proc.kill('SIGKILL');
    }
  } catch (_) {}
}

function initClient() {
  if (client || initInFlight) return;
  initInFlight = true;

  // Don't even try if the configured Chrome path doesn't exist on this
  // machine (e.g. a different PC than the one this was set up on).
  // Without this check, Puppeteer would throw and could crash the whole
  // server depending on how the rejection surfaces.
  if (!fs.existsSync(CHROME_PATH)) {
    console.warn(`[whatsapp] Skipped: Chrome not found at "${CHROME_PATH}". WhatsApp notifications are disabled on this machine. Orders will still work normally.`);
    initInFlight = false;
    return;
  }

  try {
    client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        executablePath: CHROME_PATH,
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      },
    });
    pairingRequested = false;
    initInFlight = false;

    // Watchdog: if nothing happens (no QR/pairing code, no ready) within the
    // timeout, the saved session is probably stale/corrupted and stuck
    // silently. Wipe it and retry so a fresh pairing code always eventually
    // shows up — but only up to MAX_WATCHDOG_RETRIES times, so a truly
    // broken environment fails loudly instead of looping forever.
    watchdogTimer = setTimeout(() => {
      watchdogRetryCount++;
      if (watchdogRetryCount > MAX_WATCHDOG_RETRIES) {
        console.error(
          `\n[whatsapp] ✖ Gave up after ${MAX_WATCHDOG_RETRIES} attempts — Chrome/WhatsApp Web is not starting on this machine.\n` +
          `[whatsapp]   Check: (1) is another Chrome window already using "${SESSION_DIR}"? Close all Chrome windows/processes and restart the server.\n` +
          `[whatsapp]   (2) Is "${CHROME_PATH}" a valid, working Chrome install?\n` +
          `[whatsapp] WhatsApp notifications are disabled for this run. Orders still work normally.\n`
        );
        const stuckClient = client;
        client = null;
        hardKillClient(stuckClient);
        return;
      }
      console.warn(`\n[whatsapp] ⚠ No response after ${STARTUP_WATCHDOG_MS / 1000}s (attempt ${watchdogRetryCount}/${MAX_WATCHDOG_RETRIES}). Clearing session and retrying — a pairing code will appear shortly.\n`);
      const stuckClient = client;
      client = null;
      hardKillClient(stuckClient).finally(() => {
        clearSessionFolder();
        setTimeout(initClient, 2000);
      });
    }, STARTUP_WATCHDOG_MS);

    // Instead of printing the QR itself, we use it as the trigger to request
    // an 8-character PAIRING CODE tied to OWNER_WHATSAPP_NUMBER. This is
    // WhatsApp's own official "Link with phone number" flow - no camera, no
    // QR, just typing 8 characters into the phone once. If that request
    // fails for any reason (library issue, number not set, etc.), we fall
    // back to printing the QR itself so linking is never completely blocked.
    client.on('qr', async (qr) => {
      clearWatchdog();
      if (pairingRequested) return;
      pairingRequested = true;

      const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;
      if (!ownerNumber) {
        console.warn('[whatsapp] OWNER_WHATSAPP_NUMBER not set - cannot request a pairing code. Showing QR instead:\n');
        qrcode.generate(qr, { small: true });
        return;
      }

      try {
        const code = await client.requestPairingCode(ownerNumber);
        console.log('\n[whatsapp] ==================================================');
        console.log('[whatsapp]  Enter this code on your phone (ONE TIME ONLY):');
        console.log('[whatsapp]');
        console.log('[whatsapp]      ' + code);
        console.log('[whatsapp]');
        console.log('[whatsapp]  WhatsApp > Settings > Linked Devices > Link a Device >');
        console.log('[whatsapp]  "Link with phone number instead"');
        console.log('[whatsapp] ==================================================\n');
      } catch (err) {
        console.error('[whatsapp] Could not request a pairing code, showing QR instead:', err.message || err);
        console.log('\n[whatsapp] SCAN THIS QR CODE with your phone:\n');
        qrcode.generate(qr, { small: true });
      }
    });

    client.on('ready', () => {
      clearWatchdog();
      watchdogRetryCount = 0; // fully recovered — reset the failure counter
      isReady = true;
      console.log('[whatsapp] Client is ready. Messages will now send.');
      readyPromiseResolve();
    });

    client.on('auth_failure', (msg) => {
      clearWatchdog();
      console.error(`\n[whatsapp] ⚠ Auth failed: ${msg}. Clearing session and starting fresh - a new pairing code will appear shortly.\n`);
      const failedClient = client;
      client = null;
      isReady = false;
      resetReadyPromise();
      hardKillClient(failedClient).finally(() => {
        clearSessionFolder();
        setTimeout(initClient, RECONNECT_DELAY_MS);
      });
    });

    client.on('disconnected', (reason) => {
      clearWatchdog();
      console.warn(`\n[whatsapp] ⚠ Disconnected (${reason}). WhatsApp notifications are paused.`);
      console.warn('[whatsapp] Starting a fresh session automatically - a new pairing code will appear shortly below. Just enter it again on your phone.\n');
      isReady = false;
      resetReadyPromise();

      const oldClient = client;
      client = null;

      hardKillClient(oldClient).finally(() => {
        clearSessionFolder();
        setTimeout(initClient, RECONNECT_DELAY_MS);
      });
    });

    // client.initialize() returns a promise - if it rejects and nothing
    // catches it, that's an unhandled rejection which can crash newer
    // versions of Node entirely. Always catch it.
    client.initialize().catch((err) => {
      clearWatchdog();
      console.error('[whatsapp] Failed to initialize (WhatsApp notifications disabled for now):', err.message || err);
      client = null;
    });
  } catch (err) {
    clearWatchdog();
    initInFlight = false;
    console.error('[whatsapp] Setup failed (WhatsApp notifications disabled, rest of the site is unaffected):', err.message || err);
    client = null;
  }
}

// Call this once when your server starts (e.g. in server.js / app.js)
// Safe to call even if WhatsApp isn't configured - it just no-ops.
function startWhatsApp() {
  if (!process.env.OWNER_WHATSAPP_NUMBER) {
    console.log('[whatsapp] OWNER_WHATSAPP_NUMBER not set - skipping WhatsApp setup (orders still work normally).');
    return;
  }
  try {
    initClient();
  } catch (err) {
    console.error('[whatsapp] Unexpected error during startup (ignored, server continues normally):', err.message || err);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A handful of whatsapp-web.js internal errors are known to be transient —
// they happen when WhatsApp Web's injected page script is momentarily out
// of sync right after handling a previous message, and a short retry
// almost always succeeds without needing to restart the whole client.
function isTransientSendError(err) {
  const msg = (err && err.message) || '';
  return (
    msg.includes("reading 'getChat'") ||
    msg.includes('Cannot read properties of undefined') ||
    msg.includes('Execution context was destroyed') ||
    msg.includes('detached Frame')
  );
}

// Internal helper: actually sends a WhatsApp text message to a given raw
// phone number (digits only, country code, no + and no leading 0).
// Used by both sendWhatsAppMessage() (owner) and sendWhatsAppMessageTo()
// (any other number, e.g. a customer).
async function sendToNumber(number, text, label, isRetry = false) {
  if (!number) {
    console.warn(`[whatsapp] Skipped (${label}): no phone number provided.`);
    return;
  }

  if (!client) {
    console.warn(`[whatsapp] Skipped (${label}): client not connected right now (check the terminal for a pairing code to enter).`);
    return;
  }

  try {
    // Wait (max 20s) for the client to be ready, in case a message
    // comes in right after server start, before the pairing code is entered.
    if (!isReady) {
      await Promise.race([
        readyPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('WhatsApp client not ready (pairing code not entered yet?)')), 20000)),
      ]);
    }

    const chatId = String(number).replace(/\D/g, '') + '@c.us';
    await client.sendMessage(chatId, text);
    console.log(`[whatsapp] Message sent successfully (${label}) to ${chatId}.`);
  } catch (err) {
    // One automatic retry for known-transient errors, after a short delay —
    // this alone fixes most "Cannot read properties of undefined (reading
    // 'getChat')" failures without needing a full client restart or a
    // library update. If it's not a transient error, or the retry itself
    // fails, log and give up (order creation is never blocked either way).
    if (!isRetry && isTransientSendError(err)) {
      console.warn(`[whatsapp] Transient error sending (${label}), retrying once in ${SEND_RETRY_DELAY_MS / 1000}s:`, err.message || err);
      await sleep(SEND_RETRY_DELAY_MS);
      return sendToNumber(number, text, label, true);
    }
    console.error(`[whatsapp] Failed to send message (${label}):`, err.message || err);
  }
}

// Sends to the shop owner's fixed number (OWNER_WHATSAPP_NUMBER in .env).
// Unchanged behavior from before.
async function sendWhatsAppMessage(text) {
  const number = process.env.OWNER_WHATSAPP_NUMBER;
  if (!number) {
    console.warn('[whatsapp] Skipped: OWNER_WHATSAPP_NUMBER not set in .env');
    return;
  }
  return sendToNumber(number, text, 'owner');
}

// Sends to any number you pass in — e.g. a customer's phone number
// collected at checkout. `number` should be digits only (country code,
// no + and no leading 0), same format as OWNER_WHATSAPP_NUMBER.
async function sendWhatsAppMessageTo(number, text) {
  return sendToNumber(number, text, 'customer');
}

// Nodemon restarts the process on every file save (it sends SIGUSR2), and a
// normal stop / Ctrl+C sends SIGINT/SIGTERM. Without cleaning up here, the
// old Chrome process can survive as a zombie holding the .wwebjs_auth
// profile folder locked, which breaks the *next* startup - either with
// cryptic "r" errors from sendMessage(), or "Execution context was
// destroyed" during initialize(). Killing the client here, before the
// process actually exits, prevents that.
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearWatchdog();
  if (client) {
    console.log(`[whatsapp] ${signal} received, closing WhatsApp client cleanly before restart/exit...`);
    await hardKillClient(client);
    client = null;
  }
  process.exit(0);
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGUSR2', () => shutdown('SIGUSR2')); // this is the one nodemon actually uses on restart

module.exports = { sendWhatsAppMessage, sendWhatsAppMessageTo, startWhatsApp };
