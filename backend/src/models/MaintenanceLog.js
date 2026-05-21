const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema(
  {
    area: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    performedAt: { type: Date, default: Date.now },
    cost: { type: Number, min: 0, default: 0 },
    performedBy: String,
    nextDueDate: Date,
    status: { type: String, enum: ['scheduled', 'completed', 'overdue'], default: 'completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
