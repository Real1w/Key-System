const { getKeys } = require('./lib/memoryDB');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const keys = getKeys();
        
        res.status(200).json({ 
            success: true, 
            keys: keys 
        });

    } catch (error) {
        console.error('Get keys error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
