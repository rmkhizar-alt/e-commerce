require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ----------------------------------------------------------------
// Safe route loader: if a route/controller file is missing or has a
// typo in it, this logs a clear message instead of crashing the whole
// server with a cryptic MODULE_NOT_FOUND stack trace. The route is
// simply skipped (and clearly reported) so the rest of the API still
// comes up - very useful during a live demo/check.
// ----------------------------------------------------------------
function safeRequire(relativePath, label) {
  try {
    return require(relativePath);
  } catch (err) {
    console.error(`[server] Could not load ${label} (${relativePath}): ${err.message}`);
    console.error(`[server] The rest of the API will still start, but "${label}" routes will not work until this is fixed.`);
    return null;
  }
}

const authRoutes = safeRequire('./routes/auth', 'auth');
const productRoutes = safeRequire('./routes/products', 'products');
const cartRoutes = safeRequire('./routes/cart', 'cart');
const orderRoutes = safeRequire('./routes/orders', 'orders');
const wishlistRoutes = safeRequire('./routes/wishlist', 'wishlist');
const contactRoutes = safeRequire('./routes/contact', 'contact');
const aiChatRoutes = safeRequire('./routes/aiChat', 'ai-chat');
const liveChatRoutes = safeRequire('./routes/liveChat', 'live-chat');
const adminRoutes = safeRequire('./routes/admin', 'admin');
const deliveryRoutes = safeRequire('./routes/deliveryRoutes', 'delivery');
const newsletterModule = safeRequire('./newsletter-backend', 'newsletter');
const newsletterRoutes = newsletterModule ? newsletterModule.router : null;

const app = express();
const PORT = process.env.PORT || 4000;

// ----------------------------------------------------------------
// CORS - allow the main storefront, Admin Panel Plus, and any other
// localhost port (handy during a demo/check where the frontend might
// be served on a different port than usual) to talk to this API.
// ----------------------------------------------------------------
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
const localhostAnyPort = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || localhostAnyPort.test(origin)) {
      return callback(null, true);
    }
    console.warn('[server] Blocked CORS request from:', origin);
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve product/gallery images so any client (admin panel, storefront)
// can load them directly from the backend if needed.
app.use('/images', express.static(path.join(__dirname, 'images')));

// ----------------------------------------------------------------
// Routes - each is only mounted if it loaded successfully above, so a
// single broken route file can't take down the whole API.
// ----------------------------------------------------------------
if (authRoutes) app.use('/api/auth', authRoutes);
if (productRoutes) app.use('/api/products', productRoutes);
if (cartRoutes) app.use('/api/cart', cartRoutes);
if (orderRoutes) app.use('/api/orders', orderRoutes);
if (wishlistRoutes) app.use('/api/wishlist', wishlistRoutes);
if (contactRoutes) app.use('/api/contact', contactRoutes);
if (aiChatRoutes) app.use('/api/ai-chat', aiChatRoutes);
if (liveChatRoutes) app.use('/api/live-chat', liveChatRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);
if (deliveryRoutes) app.use('/api/delivery', deliveryRoutes);
if (newsletterRoutes) app.use('/api/newsletter', newsletterRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart Choice 3D API' });
});

// ----------------------------------------------------------------
// Early, loud warnings for common misconfiguration - catches problems
// at startup instead of leaving them to surface as a confusing error
// the first time a shopper uses that feature.
// ----------------------------------------------------------------
if (!process.env.GROQ_API_KEY) {
  console.warn('[server] WARNING: GROQ_API_KEY is not set in .env — the AI chat assistant will not work until it is added.');
} else if (!process.env.GROQ_API_KEY.startsWith('gsk_')) {
  console.warn('[server] WARNING: GROQ_API_KEY does not look like a valid Groq key (should start with "gsk_"). Double-check console.groq.com/keys.');
}
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.warn('[server] WARNING: MONGODB_URI is not set in .env — the database will not connect.');
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('[server] WARNING: EMAIL_USER / EMAIL_PASS not set in .env — newsletter "new product" emails will not send.');
}

// 404 + centralized error handler (must be last)
app.use(notFound);
app.use(errorHandler);

// ----------------------------------------------------------------
// Never let an unexpected error silently kill the whole server during
// a demo/check. We still log it clearly so it can be fixed.
// ----------------------------------------------------------------
process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled promise rejection (server keeps running):', err);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception (server keeps running):', err);
});

// ----------------------------------------------------------------
// Connect to MongoDB. This runs whether the app is started locally
// (node server.js) or imported as a serverless function (Vercel).
// ----------------------------------------------------------------
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

connectDB(MONGO_URI)
  .then(() => {
    console.log('[db] MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('[db] Failed to connect to MongoDB (server keeps running, but DB-dependent routes will fail):', err.message);
  });

// ----------------------------------------------------------------
// Only start a normal "always listening" server when this file is run
// directly on your own computer (node server.js). On Vercel this file
// is imported as a module instead, so app.listen() below is skipped
// and Vercel's own runtime handles incoming requests - that also means
// the WhatsApp bot (which needs a permanently running process) only
// runs when you start the server locally, not on Vercel. Everything
// else (orders, delivery app, admin panel, etc.) works the same either
// way.
// ----------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[server] Smart Choice 3D API running on port ${PORT}`);

    try {
      const { startWhatsApp } = require('./utils/whatsapp');
      startWhatsApp();
    } catch (err) {
      console.error('[server] WhatsApp module failed to load (orders still work normally):', err.message);
    }
  });
}

module.exports = app;
