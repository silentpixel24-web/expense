const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['furniture', 'equipment', 'building', 'vehicle', 'other'], default: 'other' },
    purchaseDate: Date,
    purchaseValue: { type: Number, min: 0 },
    currentValue: { type: Number, min: 0 },
    condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'good' },
    location: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
