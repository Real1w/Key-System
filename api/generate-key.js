const { createHash } = require('crypto');
const { getKeys, setKeys, generateKey } = require('./lib/memoryDB');

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
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { hwid } = req.body;
        if (!hwid) {
            return res.status(400).json({ success: false, error: 'HWID is required' });
        }

        const keys = getKeys();
        const key = generateKey();
        const hashedHWID = hashHWID(hwid);

        // Store the key
        keys[key] = {
            hwid: hashedHWID,
            generated_at: new Date().toISOString(),
            enabled: true
        };

        setKeys(keys);

        res.status(200).json({ 
            success: true, 
            key: key
        });

    } catch (error) {
        console.error('Generate key error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
