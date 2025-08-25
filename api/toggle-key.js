const { loadKeys, saveKeys } = require('./lib/db');

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
        const { key, action } = req.body;
        
        if (!key) {
            return res.status(400).json({ success: false, error: 'Key is required' });
        }

        const keys = await loadKeys();
        
        if (!keys[key]) {
            return res.status(404).json({ success: false, error: 'Key not found' });
        }

        if (action === 'disable') {
            keys[key].enabled = false;
        } else if (action === 'enable') {
            keys[key].enabled = true;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        const saved = await saveKeys(keys);
        if (!saved) {
            return res.status(500).json({ success: false, error: 'Failed to save key state' });
        }

        res.status(200).json({ 
            success: true, 
            message: `Key ${action}d successfully` 
        });

    } catch (error) {
        console.error('Toggle key error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
