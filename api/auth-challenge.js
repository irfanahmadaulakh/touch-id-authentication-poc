export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const crypto = require("crypto");
  const challenge = crypto.randomBytes(32);
  res.json({ challenge: challenge.toJSON().data });
}
