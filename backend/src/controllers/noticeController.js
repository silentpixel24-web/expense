const Notice = require('../models/Notice');
const logActivity = require('../utils/activityLogger');

exports.listPublic = async (_req, res) => {
  const notices = await Notice.find({ isPublic: true }).sort({ createdAt: -1 }).limit(50);
  res.json(notices);
};

exports.list = async (_req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
};

exports.create = async (req, res) => {
  const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
  await logActivity({
    user: req.user._id,
    action: 'CREATE',
    entity: 'Notice',
    entityId: notice._id,
    details: { title: notice.title },
    req,
  });
  res.status(201).json(notice);
};

exports.update = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notice) return res.status(404).json({ message: 'Not found' });
  res.json(notice);
};

exports.remove = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
