const mongoose = require('mongoose');

const FilamentSchema = new mongoose.Schema(
  {
    material: { type: String, enum: ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon'], required: true },
    color: { type: String, required: true, trim: true },
    hexColor: { type: String, default: '#888888' },
    remainingWeightKg: { type: Number, required: true, default: 0 },
    totalWeightKg: { type: Number, required: true, default: 1 },
    temperatureC: { type: Number, default: 210 },
    pricePerGram: { type: Number, default: 0.03 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Filament', FilamentSchema);
