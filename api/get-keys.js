import { getAllKeys } from "./_db";

export default function handler(req, res) {
  return res.json(getAllKeys());
}
