const fs = require('fs');
const path = require('path');

const keysPath = path.join(process.cwd(), 'keys.json');
const keysData = JSON.parse(fs.readFileSync(keysPath, 'utf8'));

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, hwid } = req.body;

    if (!key || !hwid) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Missing key or HWID' 
      });
    }

    if (!keysData.keys[key]) {
      return res.json({ 
        valid: false, 
        message: 'Invalid key' 
      });
    }

    if (keysData.disabled_keys.includes(key)) {
      return res.json({ 
        valid: false, 
        message: 'Key disabled by admin' 
      });
    }

    const keyData = keysData.keys[key];

    if (keyData.hwid !== hwid) {
      return res.json({ 
        valid: false, 
        message: 'HWID mismatch' 
      });
    }

    if (keyData.enabled === false) {
      return res.json({ 
        valid: false, 
        message: 'Key disabled' 
      });
    }

    return res.json({
      valid: true,
      message: 'Key verified successfully',
      user_name: keyData.user_name,
      generated_at: keyData.generated_at,
      user_id: keyData.user_id
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'Internal server error' 
    });
  }
};
