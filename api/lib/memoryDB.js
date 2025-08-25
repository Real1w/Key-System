let keys = {};

function getKeys() {
    return keys;
}

function setKeys(newKeys) {
    keys = newKeys;
    return true;
}

function generateKey() {
    const random = Math.random().toString().substr(2, 12);
    const timestamp = Date.now().toString().substr(-6);
    return `ModX${random}${timestamp}`;
}

module.exports = { getKeys, setKeys, generateKey };
