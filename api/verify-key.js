const { createHash } = require('crypto');

let keys = {};

function hashHWID(hwid) {
    return createHash('sha256').update(hwid).digest('hex');
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ valid: false, error: 'Method not allowed' });
    }

    try {
        const { key, hwid } = req.body;
        
        if (!key || !hwid) {
            return res.status(400).json({ valid: false, error: 'Key and HWID are required' });
        }

        const hashedHWID = hashHWID(hwid);
        const keyData = keys[key];

        if (!keyData || keyData.hwid !== hashedHWID || !keyData.enabled) {
            return res.status(200).json({ valid: false, error: 'Invalid key or HWID' });
        }

        res.status(200).json({ 
            valid: true, 
            message: 'Key verified successfully',
            generated_at: keyData.generated_at
        });

    } catch (error) {
        res.status(500).json({ valid: false, error: 'Internal server error' });
    }
};
