let keys = {}; 

export function addKey(key, hwid) {
  keys[key] = { hwid, enabled: true };
}

export function getKey(key) {
  return keys[key] || null;
}

export function toggleKey(key) {
  if (keys[key]) {
    keys[key].enabled = !keys[key].enabled;
    return keys[key];
  }
  return null;
}

export function deleteKey(key) {
  delete keys[key];
}

export function getAllKeys() {
  return keys;
}
