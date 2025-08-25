const fs = require('fs').promises;
const path = require('path');

const keysFile = path.join(process.cwd(), 'keys.json');

async function loadKeys() {
    try {
        const data = await fs.readFile(keysFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        await fs.writeFile(keysFile, JSON.stringify({}));
        return {};
    }
}

async function saveKeys(keys) {
    try {
        await fs.writeFile(keysFile, JSON.stringify(keys, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving keys:', error);
        return false;
    }
}

module.exports = { loadKeys, saveKeys };
