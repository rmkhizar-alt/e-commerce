// Reads the frontend's /vision/product-data.js (a plain <script> global, not a
// CommonJS module) and imports its PRODUCTS array into MongoDB.
//
// While seeding, this also fixes bug #2 from the audit: ~200 products had no
// `icon` field and were silently falling back to the watch icon in
// shop-common.js. We assign a sensible icon per category here so the DB
// (and any future API-driven frontend) starts out correct.
//
// Usage:
//   npm run seed                (uses ../vision/product-data.js by default)
//   node scripts/seedProducts.js /path/to/product-data.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');

const DEFAULT_SOURCE = path.join(__dirname, '..', '..', 'vision', 'product-data.js');

// Category -> best-fit icon, using the keys already defined in shop-common.js's
// SC_ICONS. Anything not listed here falls back to 'cube' (a neutral 3D-box
// icon) instead of the old incorrect 'watch' default.
const CATEGORY_ICON_MAP = {
  Watches: 'watch',
  'Bags & Luggage': 'backpack',
  "Women's Fashion": 'dress',
  "Men's Fashion": 'handbag', // no dedicated men's-wear icon yet; closest neutral fit
  'Jewelry & Eyewear': 'sunglasses',
  'Sports & Outdoors': 'basketball',
  'Toys & Games': 'teddybear',
  Automotive: 'car',
  Footwear: 'cube',
  Electronics: 'cube',
  Furniture: 'cube',
  Groceries: 'cube',
  'Home & Kitchen': 'cube',
  'Kids & Baby': 'teddybear',
  'Laptops & PCs': 'cube',
  'Mobiles & Tablets': 'cube',
  'Pet Supplies': 'cube',
  'Books & Stationery': 'cube',
  'Beauty & Care': 'cube'
};

function loadProductsFromFrontend(sourcePath) {
  const code = fs.readFileSync(sourcePath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  // product-data.js just declares `var PRODUCTS = [...]` - running it in an
  // isolated sandbox context is safe and avoids needing a real browser/DOM.
  vm.runInContext(code, sandbox, { filename: sourcePath });
  if (!Array.isArray(sandbox.PRODUCTS)) {
    throw new Error(`Could not find a PRODUCTS array in ${sourcePath}`);
  }
  return sandbox.PRODUCTS;
}

function withIconFix(p) {
  const icon = p.icon || CATEGORY_ICON_MAP[p.cat] || 'cube';
  return { ...p, icon };
}

async function seed() {
  const sourcePath = process.argv[2] || DEFAULT_SOURCE;
  console.log(`[seed] Reading products from ${sourcePath}`);

  const rawProducts = loadProductsFromFrontend(sourcePath);
  const products = rawProducts.map(withIconFix);

  const missingIconCount = rawProducts.filter((p) => !p.icon).length;
  console.log(`[seed] Loaded ${products.length} products (${missingIconCount} had no icon - now fixed).`);

  await connectDB(process.env.MONGODB_URI);

  let created = 0;
  let updated = 0;
  for (const p of products) {
    const result = await Product.findOneAndUpdate(
      { id: p.id },
      { $set: p },
      { upsert: true, new: true, rawResult: true }
    );
    if (result.lastErrorObject && result.lastErrorObject.updatedExisting) updated++;
    else created++;
  }

  console.log(`[seed] Done. Created ${created}, updated ${updated}, total ${products.length}.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
