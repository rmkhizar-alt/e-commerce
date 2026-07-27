const mongoose = require('mongoose');

// Mirrors the shape of sc_cart in localStorage: [{ id, qty, opts }]
// One cart document per user; created lazily on first add.
const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // matches Product.id, not Mongo _id
    qty: { type: Number, required: true, min: 1, default: 1 },
    opts: { type: mongoose.Schema.Types.Mixed, default: {} } // e.g. { color: 'Black' }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
