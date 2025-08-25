let keys = global.keys || {};
global.keys = keys;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, hwid } = req.body;

  if (!keys[key]) {
    return res.json({ valid: false, error: "Invalid key" });
  }
  if (!keys[key].enabled) {
    return res.json({ valid: false, error: "Key disabled" });
  }
  if (keys[key].hwid !== hwid) {
    return res.json({ valid: false, error: "HWID mismatch" });
  }

  return res.json({ valid: true, message: "Key valid" });
}
