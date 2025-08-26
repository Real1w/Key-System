import { keys } from "./generate-key.js";

export default function handler(req, res) {
  // Enable CORS
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

  // Check if key exists
  if (!keys[key]) {
    return res.status(404).json({ 
      success: false, 
      error: "Key not found in database" 
    });
  }

  // Store key info before deletion for logging
  const keyInfo = { ...keys[key] };
  
  // Delete the key
  delete keys[key];

  console.log(`Deleted key ${key} with HWID ${keyInfo.hwid}`);

  res.json({ 
    success: true, 
    message: `Key ${key} deleted successfully`,
    deleted_key: key,
    deleted_hwid: keyInfo.hwid
  });
}
