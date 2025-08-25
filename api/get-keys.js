let keys = global.keys || {};
global.keys = keys;

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.json({ keys });
}
