const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

let userCredentials = {}; // Temporary storage

// Generate a random challenge for registration
app.get("/register-challenge", (req, res) => {
  const challenge = crypto.randomBytes(32);
  const userId = crypto.randomBytes(16);
  res.json({
    challenge: challenge.toJSON().data,
    userId: userId.toJSON().data,
  });
});

// Store credentials on signup
app.post("/register", (req, res) => {
  userCredentials = req.body.credential;
  res.json({ success: true });
});

// Generate challenge for authentication
app.get("/auth-challenge", (req, res) => {
  const challenge = crypto.randomBytes(32);
  res.json({ challenge: challenge.toJSON().data });
});

// Verify authentication
app.post("/authenticate", (req, res) => {
  if (userCredentials) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
