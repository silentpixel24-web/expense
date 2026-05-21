const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    category: String,
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, default: 'pcs' },
    minStock: { type: Number, default: 0 },
    lastRestocked: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
