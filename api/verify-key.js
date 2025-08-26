import { getKey } from "./_db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { key, hwid } = req.body;
  const data = getKey(key);

  if (!data) return res.json({ valid: false, error: "Key not found" });
  if (!data.enabled) return res.json({ valid: false, error: "Key disabled" });
  if (data.hwid !== hwid) return res.json({ valid: false, error: "HWID mismatch" });

  return res.json({ valid: true, message: "Key valid" });
}
