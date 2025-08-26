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

  try {
    const keyCount = Object.keys(keys).length;
    console.log(`Returning ${keyCount} keys`);
    
    res.json({ 
      success: true, 
      keys: keys,
      count: keyCount,
      message: `Retrieved ${keyCount} key(s)`
    });
  } catch (error) {
    console.error('Error retrieving keys:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error while retrieving keys"
    });
  }
}
