const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true }, // snapshot at time of order
    price: { type: Number, required: true }, // snapshot at time of order
    qty: { type: Number, required: true, min: 1 },
    opts: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const ShippingInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    // Null for guest checkout (site explicitly supports "Continue as Guest")
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isGuestOrder: { type: Boolean, default: false },
    items: { type: [OrderItemSchema], required: true },
    shipping: { type: ShippingInfoSchema, required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card', 'easypaisa', 'jazzcash'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String, default: null },
    paymentMobileNumber: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    orderNumber: { type: String, required: true, unique: true },
    // Legacy field from the admin panel's old (unused) fleet-dispatch feature.
    // Kept only so nothing breaks if old data still references it.
    assignedPrinterId: { type: String, default: null },

    // ---------------------------------------------------------------
    // Delivery boy tracking (new)
    // ---------------------------------------------------------------
    assignedDeliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', default: null },
    deliveryStatus: {
      type: String,
      enum: ['unassigned', 'assigned', 'out_for_delivery', 'delivered', 'failed'],
      default: 'unassigned'
    },
    // Optional precise pin-drop location for the customer's address, if
    // ever captured (e.g. from a "share my location" button at checkout).
    deliveryLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    // Proof captured by the delivery boy app when the order is marked delivered.
    deliveryProof: {
      deliveredAt: { type: Date, default: null },
      deliveryBoyLat: { type: Number, default: null },
      deliveryBoyLng: { type: Number, default: null },
      otpVerified: { type: Boolean, default: false },
      notes: { type: String, default: '' }
    },
    // One-time code sent to the customer to confirm hand-off at the door.
    deliveryOtp: {
      code: { type: String, default: null },
      generatedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
