const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['financial_summary', 'project', 'fundraising', 'donation_need', 'construction', 'general'],
      default: 'general',
    },
    isPublic: { type: Boolean, default: true },
    targetAmount: Number,
    raisedAmount: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    startDate: Date,
    endDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
