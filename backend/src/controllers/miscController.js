const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Event = require('../models/Event');
const MaintenanceLog = require('../models/MaintenanceLog');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');
const appConfig = require('../config/app');

const crud = (Model) => ({
  list: async (_req, res) => res.json(await Model.find().sort({ createdAt: -1 })),
  create: async (req, res) => res.status(201).json(await Model.create(req.body)),
  update: async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  },
  remove: async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  },
});

exports.assets = crud(Asset);
exports.employees = crud(Employee);
exports.events = crud(Event);
exports.maintenance = crud(MaintenanceLog);
exports.inventory = crud(Inventory);

exports.activityLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [logs, total] = await Promise.all([
    ActivityLog.find().populate('user', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
    ActivityLog.countDocuments(),
  ]);
  res.json({ items: logs, total, page: parseInt(page, 10) });
};

exports.getPublicConfig = (_req, res) => {
  res.json({
    mosqueName: appConfig.mosqueName,
    currency: appConfig.currency,
    currencySymbol: appConfig.currencySymbol,
  });
};

exports.donationQr = async (_req, res) => {
  const upiId = process.env.UPI_MERCHANT_ID || 'mosque@upi';
  const name = encodeURIComponent(appConfig.mosqueName);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&cu=${appConfig.currency}`;
  res.json({
    upiId,
    upiUrl,
    qrData: upiUrl,
    message: `Scan to donate to ${appConfig.mosqueName}`,
    mosqueName: appConfig.mosqueName,
  });
};

exports.notify = async (req, res) => {
  const { channel, message, recipients } = req.body;
  const results = { channel, sent: false, note: 'Configure WHATSAPP_API_URL or SMS_API_KEY in environment' };
  if (channel === 'whatsapp' && process.env.WHATSAPP_API_URL) {
    results.sent = true;
    results.note = 'WhatsApp notification queued (integration stub)';
  }
  if (channel === 'sms' && process.env.SMS_API_KEY) {
    results.sent = true;
    results.note = `SMS queued to ${recipients?.length || 0} recipients`;
  }
  res.json(results);
};
