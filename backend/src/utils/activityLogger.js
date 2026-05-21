const ActivityLog = require('../models/ActivityLog');
const { createAuditHash } = require('./audit');

async function logActivity({ user, action, entity, entityId, details, req }) {
  const last = await ActivityLog.findOne().sort({ createdAt: -1 }).select('hash');
  const previousHash = last?.hash || '';
  const hash = createAuditHash({ user: user.toString(), action, entity, entityId, details }, previousHash);

  await ActivityLog.create({
    user,
    action,
    entity,
    entityId,
    details,
    ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
    userAgent: req?.headers?.['user-agent'],
    hash,
    previousHash,
  });
}

module.exports = logActivity;
