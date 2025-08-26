// utils/storage.js
import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'keys.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load keys from JSON file
export const loadKeys = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading keys:', error);
  }
  
  // Return default keys if file doesn't exist or error occurred
  const defaultKeys = {
    "MODXTEST123456789": {
      hwid: "test-hwid-12345",
      enabled: true,
      generated_at: Date.now(),
      last_used: null,
      last_modified: Date.now()
    }
  };
  
  saveKeys(defaultKeys);
  return defaultKeys;
};

// Save keys to JSON file
export const saveKeys = (keys) => {
  try {
    ensureDataDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(keys, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving keys:', error);
    return false;
  }
};
