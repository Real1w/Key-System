// Load keys from the same file your bot uses
const keys = require('../keys.json');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, hwid } = req.body;

    // Validate input
    if (!key || !hwid) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Missing key or HWID' 
      });
    }

    // Check if key exists
    if (!keys.keys[key]) {
      return res.json({ 
        valid: false, 
        message: 'Invalid key' 
      });
    }

    // Check if key is disabled
    if (keys.disabled_keys.includes(key)) {
      return res.json({ 
        valid: false, 
        message: 'Key disabled by admin' 
      });
    }

    const keyData = keys.keys[key];

    // Check HWID match (exact match required)
    if (keyData.hwid !== hwid) {
      return res.json({ 
        valid: false, 
        message: 'HWID mismatch' 
      });
    }

    // Check if key is enabled
    if (keyData.enabled === false) {
      return res.json({ 
        valid: false, 
        message: 'Key disabled' 
      });
    }

    // Success!
    return res.json({
      valid: true,
      message: 'Key verified successfully',
      user_name: keyData.user_name,
      generated_at: keyData.generated_at,
      user_id: keyData.user_id
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'Internal server error' 
    });
  }
}
