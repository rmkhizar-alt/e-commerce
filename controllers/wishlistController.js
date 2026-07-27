const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

async function getOrCreate(userId) {
  let wl = await Wishlist.findOne({ user: userId });
  if (!wl) wl = await Wishlist.create({ user: userId, productIds: [] });
  return wl;
}

// GET /api/wishlist
async function getWishlist(req, res, next) {
  try {
    const wl = await getOrCreate(req.user._id);
    const products = await Product.find({ id: { $in: wl.productIds } });
    res.json({ productIds: wl.productIds, products });
  } catch (err) {
    next(err);
  }
}

// PUT /api/wishlist  { productIds: [...] }  - replace the whole list (simplest for syncing from localStorage)
async function setWishlist(req, res, next) {
  try {
    const productIds = Array.isArray(req.body.productIds) ? req.body.productIds.map(String) : [];
    const wl = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { productIds },
      { new: true, upsert: true }
    );
    res.json({ productIds: wl.productIds });
  } catch (err) {
    next(err);
  }
}

// POST /api/wishlist/:productId - add one
async function addOne(req, res, next) {
  try {
    const wl = await getOrCreate(req.user._id);
    const id = String(req.params.productId);
    if (!wl.productIds.includes(id)) wl.productIds.push(id);
    await wl.save();
    res.status(201).json({ productIds: wl.productIds });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/wishlist/:productId - remove one
async function removeOne(req, res, next) {
  try {
    const wl = await getOrCreate(req.user._id);
    wl.productIds = wl.productIds.filter((id) => id !== String(req.params.productId));
    await wl.save();
    res.json({ productIds: wl.productIds });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, setWishlist, addOne, removeOne };
