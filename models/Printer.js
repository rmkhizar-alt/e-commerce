const mongoose = require('mongoose');

const PrinterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['FDM', 'SLA', 'SLS'], default: 'FDM' },
    status: {
      type: String,
      enum: ['idle', 'printing', 'paused', 'maintenance', 'offline'],
      default: 'idle'
    },
    currentOrderNumber: { type: String, default: null },
    currentJobProgress: { type: Number, default: null },
    currentJobTimeRemaining: { type: Number, default: null },
    bedTemperature: { type: Number, default: 0 },
    nozzleTemperature: { type: Number, default: 22 },
    materialType: { type: String, default: null },
    materialColor: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Printer', PrinterSchema);
