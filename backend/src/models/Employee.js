const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['imam', 'muazzin', 'caretaker', 'admin_staff', 'other'], required: true },
    phone: String,
    email: String,
    salary: { type: Number, min: 0 },
    joinDate: Date,
    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
