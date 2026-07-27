const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DeliveryBoySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    vehicleNumber: { type: String, default: '' },
    isActive: { type: Boolean, default: true }, // admin can disable without deleting
    currentLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      updatedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

DeliveryBoySchema.methods.toSafeJSON = function () {
  return {
    _id: String(this._id),
    name: this.name,
    email: this.email,
    phone: this.phone,
    vehicleNumber: this.vehicleNumber,
    isActive: this.isActive
  };
};

module.exports = mongoose.model('DeliveryBoy', DeliveryBoySchema);

/*
  Note: password is hashed manually in adminController.js (using bcryptjs,
  same as User model's authController.js pattern) rather than a pre-save
  hook, to stay consistent with how the rest of this codebase already
  handles hashing (see authController.js signup()).
*/
