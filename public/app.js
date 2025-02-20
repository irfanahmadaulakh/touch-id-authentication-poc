async function signUp() {
  try {
    const response = await fetch("/register-challenge");
    const { challenge, userId } = await response.json();

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(challenge),
        rp: { name: "WebAuthn Demo" },
        user: {
          id: new Uint8Array(userId),
          name: "user@example.com",
          displayName: "User Example",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform" },
        timeout: 60000,
        attestation: "direct",
      },
    });

    await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credential: credential,
      }),
    });

    document.getElementById("status").innerText = "Signed up successfully!";
  } catch (error) {
    document.getElementById("status").innerText =
      "Signup failed: " + error.message;
  }
}

async function login() {
  try {
    const response = await fetch("/auth-challenge");
    const { challenge } = await response.json();

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(challenge),
        allowCredentials: [],
        timeout: 60000,
      },
    });

    const verifyResponse = await fetch("/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credential: credential,
      }),
    });

    if (verifyResponse.ok) {
      document.getElementById("status").innerText =
        "Authenticated successfully!";
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    document.getElementById("status").innerText =
      "Login failed: " + error.message;
  }
}
