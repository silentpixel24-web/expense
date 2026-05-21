const Expenditure = require('../models/Expenditure');
const { createAuditHash } = require('../utils/audit');
const { generateExpenseReference } = require('../utils/receiptNumber');
const logActivity = require('../utils/activityLogger');

exports.list = async (req, res) => {
  try {
    const { category, status, from, to, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (search) {
      filter.$or = [
        { referenceNumber: new RegExp(search, 'i') },
        { vendor: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [items, total] = await Promise.all([
      Expenditure.find(filter).populate('createdBy', 'name').populate('approvedBy', 'name').sort({ date: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Expenditure.countDocuments(filter),
    ]);
    res.json({ items, total, page: parseInt(page, 10), pages: Math.ceil(total / parseInt(limit, 10)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const referenceNumber = await generateExpenseReference();
    const auditHash = createAuditHash({ ...req.body, referenceNumber });
    const data = {
      ...req.body,
      referenceNumber,
      auditHash,
      createdBy: req.user._id,
      billAttachment: req.file ? `/uploads/${req.file.filename}` : undefined,
      status: req.user.role === 'admin' || req.user.role === 'treasurer' ? 'approved' : 'pending',
    };
    if (data.status === 'approved') {
      data.approvedBy = req.user._id;
      data.approvedAt = new Date();
    }
    const expense = await Expenditure.create(data);
    await logActivity({
      user: req.user._id,
      action: 'CREATE',
      entity: 'Expenditure',
      entityId: expense._id,
      details: { referenceNumber, amount: expense.amount },
      req,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const expense = await Expenditure.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });
    Object.assign(expense, req.body);
    if (req.file) expense.billAttachment = `/uploads/${req.file.filename}`;
    expense.auditHash = createAuditHash(expense.toObject());
    await expense.save();
    await logActivity({
      user: req.user._id,
      action: 'UPDATE',
      entity: 'Expenditure',
      entityId: expense._id,
      details: req.body,
      req,
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }
    const expense = await Expenditure.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });
    expense.status = status;
    expense.approvedBy = req.user._id;
    expense.approvedAt = new Date();
    await expense.save();
    await logActivity({
      user: req.user._id,
      action: status.toUpperCase(),
      entity: 'Expenditure',
      entityId: expense._id,
      details: { referenceNumber: expense.referenceNumber },
      req,
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const expense = await Expenditure.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });
    await logActivity({
      user: req.user._id,
      action: 'DELETE',
      entity: 'Expenditure',
      entityId: expense._id,
      details: { referenceNumber: expense.referenceNumber },
      req,
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  const expense = await Expenditure.findById(req.params.id).populate('createdBy', 'name').populate('approvedBy', 'name');
  if (!expense) return res.status(404).json({ message: 'Not found' });
  res.json(expense);
};
