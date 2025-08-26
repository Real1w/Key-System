import { keys } from "./generate-key";

export default function handler(req, res) {
  res.json({ success: true, keys });
}
