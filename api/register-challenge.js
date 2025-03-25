module.exports = (req, res) => {
  const crypto = require("crypto");

  if (req.method === "GET") {
    const challenge = crypto.randomBytes(32);
    const userId = crypto.randomBytes(16);

    res.status(200).json({
      challenge: challenge.toJSON().data,
      userId: userId.toJSON().data,
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
