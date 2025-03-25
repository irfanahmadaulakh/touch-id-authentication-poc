export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const crypto = require("crypto");
  const challenge = crypto.randomBytes(32);
  const userId = crypto.randomBytes(16);

  res.json({
    challenge: challenge.toJSON().data,
    userId: userId.toJSON().data,
  });
}
