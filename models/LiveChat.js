// models/LiveChat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['visitor', 'team'], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const liveChatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true, unique: true },
    visitorName: { type: String, default: '' },
    visitorEmail: { type: String, default: '' },
    messages: { type: [messageSchema], default: [] },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveChat', liveChatSchema);
