const { getKeys, normalizeHWID } = require('./lib/memoryDB');

module.exports = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ valid: false, error: 'Method not allowed' });

  try {
    const { key, hwid } = req.body || {};
    if (!key || !hwid) return res.status(400).json({ valid: false, error: 'Key and HWID required' });

    const keys = getKeys();
    const record = keys[key];
    if (!record) return res.status(200).json({ valid: false, error: 'Key not found' });

    const normalized = normalizeHWID(hwid);
    if (!record.enabled) return res.status(200).json({ valid: false, error: 'Key disabled' });
    if (record.hwid !== normalized) return res.status(200).json({ valid: false, error: 'HWID mismatch' });

    return res.status(200).json({ valid: true, message: 'Key verified successfully', generated_at: record.generated_at });
  } catch (err) {
    console.error('verify-key error', err);
    return res.status(500).json({ valid: false, error: 'Internal server error' });
  }
};
