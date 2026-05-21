const crypto = require('crypto');

function createAuditHash(data, previousHash = '') {
  const payload = JSON.stringify({ ...data, previousHash, ts: Date.now() });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

function verifyChain(records) {
  for (let i = 0; i < records.length; i++) {
    const expected = createAuditHash(
      records[i].details || records[i],
      i > 0 ? records[i - 1].hash : ''
    );
    if (records[i].hash && records[i].hash !== expected && i > 0) {
      return { valid: false, index: i };
    }
  }
  return { valid: true };
}

module.exports = { createAuditHash, verifyChain };
