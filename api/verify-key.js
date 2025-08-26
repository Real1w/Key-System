import { keys } from "./generate-key";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, hwid } = req.body;
  const record = keys[key];

  if (!record) {
    return res.json({ valid: false, error: "Key not found" });
  }
  if (record.hwid !== hwid) {
    return res.json({ valid: false, error: "HWID mismatch" });
  }
  if (!record.enabled) {
    return res.json({ valid: false, error: "Key disabled" });
  }

  res.json({ valid: true, message: "Key valid" });
}
