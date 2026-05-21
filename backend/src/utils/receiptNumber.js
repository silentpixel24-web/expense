const Income = require('../models/Income');
const Expenditure = require('../models/Expenditure');

async function generateIncomeReceipt() {
  const year = new Date().getFullYear();
  const prefix = `INC-${year}-`;
  const last = await Income.findOne({ receiptNumber: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 })
    .select('receiptNumber');
  const num = last ? parseInt(last.receiptNumber.split('-').pop(), 10) + 1 : 1;
  return `${prefix}${String(num).padStart(5, '0')}`;
}

async function generateExpenseReference() {
  const year = new Date().getFullYear();
  const prefix = `EXP-${year}-`;
  const last = await Expenditure.findOne({ referenceNumber: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 })
    .select('referenceNumber');
  const num = last ? parseInt(last.referenceNumber.split('-').pop(), 10) + 1 : 1;
  return `${prefix}${String(num).padStart(5, '0')}`;
}

module.exports = { generateIncomeReceipt, generateExpenseReference };
