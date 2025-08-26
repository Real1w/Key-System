import { keys } from "./generate-key.js";

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed. Use GET." 
    });
  }

  const keyCount = Object.keys(keys).length;
  const activeKeys = Object.values(keys).filter(key => key.enabled).length;
  const inactiveKeys = keyCount - activeKeys;

  res.json({
    success: true,
    status: "online",
    timestamp: new Date().toISOString(),
    server_time: Date.now(),
    version: "1.0.0",
    statistics: {
      total_keys: keyCount,
      active_keys: activeKeys,
      inactive_keys: inactiveKeys
    },
    endpoints: [
      "POST /api/generate-key",
      "POST /api/verify-key", 
      "GET /api/get-keys",
      "POST /api/toggle-key",
      "POST /api/delete-key",
      "GET /api/status"
    ],
    message: "ModX Key System API is running successfully"
  });
}
