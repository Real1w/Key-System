import { keys } from "./generate-key.js";

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ 
      valid: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  const { key, hwid } = req.body;

  if (!key || !hwid) {
    return res.status(400).json({ 
      valid: false, 
      error: "Both key and HWID are required" 
    });
  }

  console.log(`Verifying key: ${key} with HWID: ${hwid}`);
  console.log(`Available keys:`, Object.keys(keys));

  const record = keys[key];
  if (!record) {
    console.log(`Key not found: ${key}`);
    return res.json({ 
      valid: false, 
      error: "Key not found in database" 
    });
  }

  if (record.hwid !== hwid) {
    console.log(`HWID mismatch. Expected: ${record.hwid}, Got: ${hwid}`);
    return res.json({ 
      valid: false, 
      error: "HWID mismatch - this key is registered to a different device" 
    });
  }

  if (!record.enabled) {
    console.log(`Key is disabled: ${key}`);
    return res.json({ 
      valid: false, 
      error: "Key has been disabled" 
    });
  }

  keys[key].last_used = Date.now();
  console.log(`Key verification successful: ${key}`);
  
  res.json({ 
    valid: true, 
    message: "Key verification successful",
    key: key,
    hwid: hwid
  });
}
