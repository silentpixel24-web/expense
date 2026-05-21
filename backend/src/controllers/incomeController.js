const Income = require('../models/Income');
const { createAuditHash } = require('../utils/audit');
const { generateIncomeReceipt } = require('../utils/receiptNumber');
const logActivity = require('../utils/activityLogger');

exports.list = async (req, res) => {
  try {
    const { source, from, to, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (source) filter.source = source;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (search) {
      filter.$or = [
        { receiptNumber: new RegExp(search, 'i') },
        { donorName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [items, total] = await Promise.all([
      Income.find(filter).populate('createdBy', 'name').sort({ date: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Income.countDocuments(filter),
    ]);
    res.json({ items, total, page: parseInt(page, 10), pages: Math.ceil(total / parseInt(limit, 10)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const receiptNumber = await generateIncomeReceipt();
    const auditHash = createAuditHash({ ...req.body, receiptNumber });
    const data = {
      ...req.body,
      receiptNumber,
      auditHash,
      createdBy: req.user._id,
      receiptImage: req.file ? `/uploads/${req.file.filename}` : undefined,
    };
    const income = await Income.create(data);
    await logActivity({
      user: req.user._id,
      action: 'CREATE',
      entity: 'Income',
      entityId: income._id,
      details: { receiptNumber, amount: income.amount },
      req,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: 'Not found' });
    Object.assign(income, req.body);
    if (req.file) income.receiptImage = `/uploads/${req.file.filename}`;
    income.auditHash = createAuditHash(income.toObject());
    await income.save();
    await logActivity({
      user: req.user._id,
      action: 'UPDATE',
      entity: 'Income',
      entityId: income._id,
      details: req.body,
      req,
    });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: 'Not found' });
    await logActivity({
      user: req.user._id,
      action: 'DELETE',
      entity: 'Income',
      entityId: income._id,
      details: { receiptNumber: income.receiptNumber },
      req,
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  const income = await Income.findById(req.params.id).populate('createdBy', 'name');
  if (!income) return res.status(404).json({ message: 'Not found' });
  res.json(income);
};
