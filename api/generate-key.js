let keys = global.keys || {};
global.keys = keys;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hwid } = req.body;
  if (!hwid) return res.json({ success: false, error: "HWID required" });

  const randomNum = Math.floor(Math.random() * 1e18); 
  const newKey = `ModX${randomNum}`;

  keys[newKey] = { hwid, enabled: true };

  return res.json({
    success: true,
    key: newKey,
    hwid,
    enabled: true
  });
}
