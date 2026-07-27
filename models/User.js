const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    // shipping addresses the user has saved, used to prefill checkout
    addresses: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String
      }
    ]
  },
  { timestamps: true }
);

// Never send the password hash to the client
UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    isAdmin: this.isAdmin,
    addresses: this.addresses,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', UserSchema);
