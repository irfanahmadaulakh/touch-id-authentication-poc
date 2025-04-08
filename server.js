const express = require("express");
const session = require("express-session");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

let userCredentials = {};

app.get("/register-challenge", (req, res) => {
  const challenge = crypto.randomBytes(32);
  const userId = crypto.randomBytes(16);
  res.json({ challenge: [...challenge], userId: [...userId] });
});

app.post("/register", (req, res) => {
  userCredentials = req.body.credential;
  req.session.isBiometricEnabled = true;
  res.json({ success: true });
});

app.get("/auth-challenge", (req, res) => {
  const challenge = crypto.randomBytes(32);
  res.json({ challenge: [...challenge] });
});

app.post("/authenticate", (req, res) => {
  if (userCredentials) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Authentication failed" });
  }
});

app.get("/session-status", (req, res) => {
  res.json({
    loggedIn: req.session.loggedIn || false,
    biometricEnabled: req.session.isBiometricEnabled || false,
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
