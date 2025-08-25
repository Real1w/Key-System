let keys = global.keys || {};
global.keys = keys;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key } = req.body;
  if (!keys[key]) return res.json({ success: false, error: "Key not found" });

  keys[key].enabled = !keys[key].enabled;

  return res.json({ success: true, key, enabled: keys[key].enabled });
}
