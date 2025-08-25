const { createHash } = require('crypto');

// Use a simple in-memory storage (for production, use a database)
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
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { key, hwid } = JSON.parse(body);
                
                if (!key || !hwid) {
                    return res.status(400).json({ valid: false, error: 'Key and HWID are required' });
                }

                const hashedHWID = hashHWID(hwid);
                const keyData = keys[key];

                if (!keyData) {
                    return res.status(200).json({ 
                        valid: false, 
                        error: 'Key not found' 
                    });
                }

                if (keyData.hwid !== hashedHWID) {
                    return res.status(200).json({ 
                        valid: false, 
                        error: 'HWID mismatch' 
                    });
                }

                if (!keyData.enabled) {
                    return res.status(200).json({ 
                        valid: false, 
                        error: 'Key is disabled' 
                    });
                }

                res.status(200).json({ 
                    valid: true, 
                    message: 'Key verified successfully',
                    generated_at: keyData.generated_at
                });

            } catch (parseError) {
                res.status(400).json({ valid: false, error: 'Invalid JSON format' });
            }
        });

    } catch (error) {
        res.status(500).json({ valid: false, error: 'Internal server error: ' + error.message });
    }
};
