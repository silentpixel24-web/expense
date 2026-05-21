const mongoose = require('mongoose');

const INCOME_SOURCES = [
  'friday_collection',
  'donation_box',
  'online_donation',
  'zakat',
  'sadaqah',
  'building_fund',
  'event_contribution',
  'monthly_member',
  'ramadan_collection',
  'other',
];

const incomeSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    source: { type: String, enum: INCOME_SOURCES, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    date: { type: Date, required: true, default: Date.now },
    donorName: { type: String, trim: true },
    donorPhone: { type: String, trim: true },
    description: { type: String, trim: true },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'bank', 'card', 'online'], default: 'cash' },
    receiptImage: String,
    isPublic: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auditHash: { type: String, required: true },
  },
  { timestamps: true }
);

incomeSchema.index({ date: -1 });
incomeSchema.index({ source: 1 });

module.exports = mongoose.model('Income', incomeSchema);
module.exports.INCOME_SOURCES = INCOME_SOURCES;
