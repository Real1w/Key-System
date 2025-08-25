const { createHash } = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const keysFile = path.join(process.cwd(), 'keys.json');

async function loadKeys() {
    try {
        const data = await fs.readFile(keysFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function saveKeys(keys) {
    await fs.writeFile(keysFile, JSON.stringify(keys, null, 2));
}

function generateKey() {
    const random = Math.random().toString().substr(2, 12);
    const timestamp = Date.now().toString().substr(-6);
    return `ModX${random}${timestamp}`;
}

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

        const keys = await loadKeys();
        const key = generateKey();
        const hashedHWID = hashHWID(hwid);

        keys[key] = {
            hwid: hashedHWID,
            generated_at: new Date().toISOString(),
            enabled: true
        };

        await saveKeys(keys);

        res.status(200).json({ 
            success: true, 
            key: key
        });

    } catch (error) {
        console.error('Generate key error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
