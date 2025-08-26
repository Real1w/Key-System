import { addKey } from "./_db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { hwid } = req.body;
  if (!hwid) return res.json({ success: false, error: "HWID required" });

  const newKey = "ModX" + Math.floor(Math.random() * 1e18);

  addKey(newKey, hwid);

  return res.json({
    success: true,
    key: newKey,
    hwid,
    enabled: true
  });
}
