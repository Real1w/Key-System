import { toggleKey } from "./_db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { key } = req.body;
  const updated = toggleKey(key);
  if (!updated) return res.json({ success: false, error: "Key not found" });

  return res.json({ success: true, key, enabled: updated.enabled });
}
