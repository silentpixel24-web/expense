const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = [
  'electricity',
  'water',
  'imam_salary',
  'muazzin_salary',
  'maintenance',
  'cleaning',
  'construction',
  'charity',
  'event',
  'food',
  'education',
  'other',
];

const expenditureSchema = new mongoose.Schema(
  {
    referenceNumber: { type: String, required: true, unique: true },
    category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    date: { type: Date, required: true, default: Date.now },
    vendor: { type: String, trim: true },
    description: { type: String, trim: true },
    billAttachment: String,
    paymentMethod: { type: String, enum: ['cash', 'upi', 'bank', 'cheque'], default: 'bank' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    isRecurring: { type: Boolean, default: false },
    recurringDay: { type: Number, min: 1, max: 28 },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auditHash: { type: String, required: true },
  },
  { timestamps: true }
);

expenditureSchema.index({ date: -1 });
expenditureSchema.index({ status: 1 });
expenditureSchema.index({ category: 1 });

module.exports = mongoose.model('Expenditure', expenditureSchema);
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
