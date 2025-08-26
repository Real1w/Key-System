let keys = {};

if (Object.keys(keys).length === 0) {
  keys["ModXTEST123456789"] = {
    hwid: "test-hwid-12345",
    enabled: true,
    generated_at: Date.now(),
    last_used: null,
    last_modified: Date.now()
  };
  console.log("Initialized with test key");
}

export default function handler(req, res) {
  // CORS headers
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

  const { hwid } = req.body;
  
  if (!hwid || typeof hwid !== 'string' || hwid.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: "Valid HWID is required" 
    });
  }

  // Check if HWID already has a key
  const existingKey = Object.keys(keys).find(key => keys[key].hwid === hwid);
  if (existingKey) {
    return res.json({
      success: true,
      key: existingKey,
      hwid: hwid,
      enabled: keys[existingKey].enabled,
      message: "Key already exists for this HWID"
    });
  }

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const key = `ModX${timestamp}${random}`.toUpperCase();
  
  keys[key] = {
    hwid: hwid.trim(),
    enabled: true,
    generated_at: Date.now(),
    last_used: null,
    last_modified: Date.now()
  };

  console.log(`Generated new key: ${key} for HWID: ${hwid}`);
  
  res.json({ 
    success: true, 
    key, 
    hwid: hwid.trim(), 
    enabled: true,
    message: "Key generated successfully"
  });
}

export { keys };
