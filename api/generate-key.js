let keys = {};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hwid } = req.body;
  if (!hwid) {
    return res.status(400).json({ success: false, error: "HWID required" });
  }

  // generate key
  const key = "ModX" + Math.floor(Math.random() * 1e15);

  keys[key] = {
    hwid,
    enabled: true,
    generated_at: Date.now(),
  };

  res.json({ success: true, key, hwid, enabled: true });
}

export { keys };
