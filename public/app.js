async function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Simulate dummy login validation (replace with real validation logic)
  if (username === "user" && password === "password123") {
    document.getElementById("status").innerText = "Login successful!";

    // Show the biometric save prompt after login
    document.getElementById("savePrompt").classList.remove("hidden");
  } else {
    document.getElementById("status").innerText = "Invalid credentials!";
  }
}

// function saveBiometric() {
//   // Set a cookie to store biometric login enabled
//   document.cookie =
//     "biometricLogin=true; path=/; max-age=" + 60 * 60 * 24 * 365; // 1 year cookie
//   document.getElementById("savePrompt").classList.add("hidden");

//   // Proceed to trigger biometric authentication
//   triggerBiometricAuthentication();
// }
function saveBiometric() {
  // Simulate storing a credential ID (normally you'd get this from WebAuthn registration)
  const fakeCredentialId = new Uint8Array(16);
  window.crypto.getRandomValues(fakeCredentialId);
  const base64Id = btoa(String.fromCharCode(...fakeCredentialId));
  localStorage.setItem("credentialId", base64Id);

  // Set the biometric login flag
  document.cookie =
    "biometricLogin=true; path=/; max-age=" + 60 * 60 * 24 * 365;

  document.getElementById("savePrompt").classList.add("hidden");

  // Trigger biometric
  triggerBiometricAuthentication();
}

function closePrompt() {
  document.getElementById("savePrompt").classList.add("hidden");
}

// function triggerBiometricAuthentication() {
//   if (navigator.credentials && navigator.credentials.get) {
//     navigator.credentials
//       .get({
//         publicKey: {
//           challenge: new Uint8Array(32), // Placeholder for challenge, you should generate a real one
//           timeout: 60000,
//         },
//       })
//       .then((credential) => {
//         document.getElementById("status").innerText =
//           "Biometric authentication successful!";
//       })
//       .catch((err) => {
//         document.getElementById("status").innerText =
//           "Biometric authentication failed!";
//       });
//   } else {
//     document.getElementById("status").innerText =
//       "Biometric authentication is not supported.";
//   }
// }
function triggerBiometricAuthentication() {
  const storedId = localStorage.getItem("credentialId");

  if (navigator.credentials && navigator.credentials.get && storedId) {
    const idBytes = Uint8Array.from(atob(storedId), (c) => c.charCodeAt(0));

    navigator.credentials
      .get({
        publicKey: {
          challenge: new Uint8Array(32), // Simulated challenge (use real one from server in production)
          timeout: 60000,
          allowCredentials: [
            {
              type: "public-key",
              id: idBytes,
              transports: ["internal"], // Optional: limits to built-in biometrics
            },
          ],
        },
      })
      .then((credential) => {
        document.getElementById("status").innerText =
          "Biometric authentication successful!";
      })
      .catch((err) => {
        document.getElementById("status").innerText =
          "Biometric authentication failed!";
      });
  } else {
    document.getElementById("status").innerText =
      "Biometric authentication is not supported or credential not found.";
  }
}

function checkBiometricSession() {
  const cookies = document.cookie.split(";");
  let biometricLogin = false;

  // Check for the "biometricLogin" cookie
  cookies.forEach((cookie) => {
    if (cookie.trim().startsWith("biometricLogin=")) {
      biometricLogin = true;
    }
  });

  if (biometricLogin) {
    // If the biometric login cookie is set, trigger biometric authentication
    triggerBiometricAuthentication();
  }
}

// Check the biometric session on page load
window.onload = function () {
  checkBiometricSession();
};
