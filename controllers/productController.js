const Product = require('../models/Product');
const { isDbReady } = require('../config/db');
const { notifyNewProduct } = require('../newsletter-backend');

// GET /api/products?cat=Watches&q=steel&minPrice=10&maxPrice=200&sort=price_asc&page=1&limit=24
async function list(req, res, next) {
  try {
    const { cat, sub, brand, q, minPrice, maxPrice, sort } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), 100);

    // DB not connected right now — instead of throwing/crashing this
    // request, return an empty (but well-formed) result so the storefront
    // UI still renders normally (e.g. "no products found" instead of an error page).
    if (!isDbReady()) {
      console.warn('[products] DB not connected — returning empty list.');
      return res.json({ items: [], total: 0, page, pages: 0, dbOffline: true });
    }

    const filter = {};
    if (cat) filter.cat = cat;
    if (sub) filter.sub = sub;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      newest: { createdAt: -1 }
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    // Safety net: even if something above slips through (e.g. connection
    // dropped mid-request), don't 500 the whole page — degrade gracefully.
    console.error('[products] list() failed, returning empty list:', err.message);
    res.json({ items: [], total: 0, page: 1, pages: 0, dbOffline: true });
  }
}

// GET /api/products/:id  (id is the string product id like 'wch-101', not Mongo _id)
async function getOne(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Product details are temporarily unavailable (database offline). Please try again shortly.' });
    }
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    console.error('[products] getOne() failed:', err.message);
    res.status(503).json({ error: 'Product details are temporarily unavailable (database offline). Please try again shortly.' });
  }
}

// GET /api/products/:id/related?limit=4
async function related(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.json({ items: [] });
    }
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 20);

    let items = await Product.find({ cat: product.cat, id: { $ne: product.id } }).limit(limit);
    if (items.length < limit) {
      const more = await Product.find({ cat: { $ne: product.cat } }).limit(limit - items.length);
      items = items.concat(more);
    }
    res.json({ items });
  } catch (err) {
    console.error('[products] related() failed, returning empty list:', err.message);
    res.json({ items: [] });
  }
}

// GET /api/products/meta/categories
async function categories(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.json({ categories: [] });
    }
    const cats = await Product.distinct('cat');
    res.json({ categories: cats.sort() });
  } catch (err) {
    console.error('[products] categories() failed, returning empty list:', err.message);
    res.json({ categories: [] });
  }
}

// POST /api/products  (admin) — this one genuinely needs the DB to save
// anything, so it's fine (and expected) for it to report an error while
// the DB is down rather than pretend to succeed.
async function create(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot save product right now — database is offline. Please try again shortly.' });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ product });

    // Newsletter: naya product ban gaya, sab subscribers ko email + notification
    // bhej do. res.status() ke baad call kiya taake customer/admin ko response
    // milne me delay na ho — agar email fail bhi ho jaye, product creation par
    // koi asar nahi padega.
    notifyNewProduct(product).catch((err) => {
      console.error('[products] notifyNewProduct() failed:', err.message);
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id  (admin)
async function update(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot update product right now — database is offline. Please try again shortly.' });
    }
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id  (admin)
async function remove(req, res, next) {
  try {
    if (!isDbReady()) {
      return res.status(503).json({ error: 'Cannot delete product right now — database is offline. Please try again shortly.' });
    }
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, related, categories, create, update, remove };
