const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

// Attaches live product details to each cart line so the frontend doesn't
// need a second round trip, mirroring what getProductById() does client-side.
async function hydrate(cart) {
  const ids = cart.items.map((i) => i.productId);
  const products = await Product.find({ id: { $in: ids } });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  return {
    items: cart.items.map((i) => ({
      productId: i.productId,
      qty: i.qty,
      opts: i.opts,
      product: byId[i.productId] || null
    }))
  };
}

// GET /api/cart
async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items  { productId, qty, opts }
async function addItem(req, res, next) {
  try {
    const { productId, qty, opts } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required.' });

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const cart = await getOrCreateCart(req.user._id);
    const addQty = Math.max(parseInt(qty, 10) || 1, 1);
    const optsKey = JSON.stringify(opts || {});
    const existing = cart.items.find(
      (i) => i.productId === productId && JSON.stringify(i.opts || {}) === optsKey
    );
    if (existing) existing.qty += addQty;
    else cart.items.push({ productId, qty: addQty, opts: opts || {} });

    await cart.save();
    res.status(201).json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/items/:productId  { qty }
async function updateItem(req, res, next) {
  try {
    const { qty } = req.body;
    const newQty = parseInt(qty, 10);
    if (!newQty || newQty < 1) return res.status(400).json({ error: 'qty must be at least 1.' });

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.productId === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not in cart.' });

    item.qty = newQty;
    await cart.save();
    res.json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:productId
async function removeItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
    await cart.save();
    res.json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart
async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/sync  { items: [{ id, qty, opts }] }
// Lets the frontend push its localStorage sc_cart into the DB right after login,
// so a guest's in-progress cart isn't lost when they sign in.
async function syncCart(req, res, next) {
  try {
    const localItems = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await getOrCreateCart(req.user._id);

    for (const li of localItems) {
      const optsKey = JSON.stringify(li.opts || {});
      const existing = cart.items.find(
        (i) => i.productId === li.id && JSON.stringify(i.opts || {}) === optsKey
      );
      if (existing) existing.qty += li.qty || 1;
      else cart.items.push({ productId: li.id, qty: li.qty || 1, opts: li.opts || {} });
    }

    await cart.save();
    res.json(await hydrate(cart));
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, syncCart };
