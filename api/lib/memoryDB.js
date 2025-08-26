// api/lib/memoryDB.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const KEY_FILE = path.join(os.tmpdir(), 'modx-keys.json');

let keys = null;

function load() {
  try {
    if (fs.existsSync(KEY_FILE)) {
      const raw = fs.readFileSync(KEY_FILE, 'utf8') || '{}';
      keys = JSON.parse(raw);
    } else {
      keys = {};
      fs.writeFileSync(KEY_FILE, JSON.stringify(keys, null, 2));
    }
  } catch (e) {
    console.error('load keys error', e);
    keys = {};
  }
  return keys;
}

function save() {
  try {
    fs.writeFileSync(KEY_FILE, JSON.stringify(keys || {}, null, 2));
  } catch (e) {
    console.error('save keys error', e);
  }
}

function getKeys() {
  if (!keys) load();
  return keys;
}

function setKeys(newKeys) {
  keys = newKeys || {};
  save();
  return true;
}

function generateKey() {
  const rndBig = BigInt('0x' + crypto.randomBytes(8).toString('hex')).toString();
  const suffix = Date.now().toString().slice(-9);
  return `ModX${rndBig}${suffix}`;
}

function normalizeHWID(hwid) {
  if (!hwid || typeof hwid !== 'string') return '';
  const trimmed = hwid.trim();
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return trimmed.toLowerCase();
  return crypto.createHash('sha256').update(trimmed).digest('hex');
}

module.exports = { getKeys, setKeys, generateKey, normalizeHWID };
