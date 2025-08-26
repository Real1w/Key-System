const { getKeys, setKeys } = require('./lib/memoryDB');

module.exports = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { key, action } = req.body || {};
    if (!key) return res.status(400).json({ success: false, error: 'Key is required' });

    const keys = getKeys();
    if (!keys[key]) return res.status(404).json({ success: false, error: 'Key not found' });

    if (action === 'disable') keys[key].enabled = false;
    else if (action === 'enable') keys[key].enabled = true;
    else keys[key].enabled = !keys[key].enabled;

    setKeys(keys);
    return res.status(200).json({ success: true, key, enabled: keys[key].enabled });
  } catch (err) {
    console.error('toggle-key error', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
