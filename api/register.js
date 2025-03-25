let userCredentials = {}; // Temporary storage for credentials

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  userCredentials = req.body.credential;
  res.json({ success: true });
}
