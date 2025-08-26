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
      success: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  const { key } = req.body;

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: "Valid key is required" 
    });
  }

  if (!keys[key]) {
    return res.status(404).json({ 
      success: false, 
      error: "Key not found in database" 
    });
  }

  const wasEnabled = keys[key].enabled;
  keys[key].enabled = !wasEnabled;
  keys[key].last_modified = Date.now();

  console.log(`Toggled key ${key}: ${wasEnabled} -> ${keys[key].enabled}`);

  res.json({ 
    success: true, 
    key: key, 
    enabled: keys[key].enabled,
    message: `Key ${keys[key].enabled ? 'enabled' : 'disabled'} successfully`
  });
}
