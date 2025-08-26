// api/generate-key.js
const { getKeys, setKeys, generateKey, normalizeHWID } = require('./lib/memoryDB');

module.exports = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { hwid } = req.body || {};
    if (!hwid) return res.status(400).json({ success: false, error: 'HWID required' });

    const keys = getKeys();
    const key = generateKey();
    const normalized = normalizeHWID(hwid);

    keys[key] = { hwid: normalized, generated_at: new Date().toISOString(), enabled: true };
    setKeys(keys);

    return res.status(200).json({ success: true, key, hwid: normalized, enabled: true });
  } catch (err) {
    console.error('generate-key error', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
