const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    eventDate: { type: Date, required: true },
    budget: { type: Number, min: 0, default: 0 },
    spent: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ['planned', 'ongoing', 'completed', 'cancelled'], default: 'planned' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
