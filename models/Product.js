const mongoose = require('mongoose');

// Mirrors the shape of entries in the frontend's product-data.js PRODUCTS array,
// so the seed script can import it 1:1 and the API can return objects the
// existing frontend code (getProductById, productThumbHTML, etc.) already understands.
const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // e.g. 'wch-101'
    cat: { type: String, required: true, index: true },
    sub: { type: String, default: '' },
    brand: { type: String, default: '' },
    name: { type: String, required: true },
    desc: { type: String, default: '' },
    price: { type: Number, required: true },
    old: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    uid: { type: String, default: '' }, // Sketchfab model uid
    icon: { type: String, default: 'cube' }, // fallback fixed here at the data layer too
    c1: { type: String, default: '#6c5ce7' },
    c2: { type: String, default: '#a29bfe' },
    colors: { type: [String], default: [] },
    img: { type: String, default: '' },
    stock: { type: Number, default: 100 }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', brand: 'text', desc: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
