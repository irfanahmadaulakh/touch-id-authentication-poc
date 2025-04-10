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
  document.cookie =
    "biometricLogin=true; path=/; max-age=" + 60 * 60 * 24 * 365;

  document.getElementById("savePrompt").classList.add("hidden");

  registerBiometricCredential(); // <-- Register the biometric credential
}

// function saveBiometric() {
//   // Simulate storing a credential ID (normally you'd get this from WebAuthn registration)
//   const fakeCredentialId = new Uint8Array(16);
//   window.crypto.getRandomValues(fakeCredentialId);
//   const base64Id = btoa(String.fromCharCode(...fakeCredentialId));
//   localStorage.setItem("credentialId", base64Id);

//   // Set the biometric login flag
//   document.cookie =
//     "biometricLogin=true; path=/; max-age=" + 60 * 60 * 24 * 365;

//   document.getElementById("savePrompt").classList.add("hidden");

//   // Trigger biometric
//   triggerBiometricAuthentication();
// }

function closePrompt() {
  document.getElementById("savePrompt").classList.add("hidden");
}

async function registerBiometricCredential() {
  const publicKey = {
    challenge: new Uint8Array(32), // Normally from server
    rp: {
      name: "Focus Broadband App",
    },
    user: {
      id: new Uint8Array(16), // Should be a unique user ID
      name: "user@focus.com",
      displayName: "Focus User",
    },
    pubKeyCredParams: [
      {
        type: "public-key",
        alg: -7, // ES256 algorithm
      },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Use device biometrics
      userVerification: "preferred",
    },
    timeout: 60000,
    attestation: "none",
  };

  try {
    const credential = await navigator.credentials.create({ publicKey });

    // Save credential ID to localStorage for reuse
    if (credential && credential.rawId) {
      localStorage.setItem(
        "credentialId",
        arrayBufferToBase64(credential.rawId)
      );
      console.log("Credential registered and saved.");
    }
  } catch (err) {
    console.error("Credential registration failed:", err);
  }
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
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
  if (!storedId) {
    console.log("No stored credential ID found.");
    return;
  }

  navigator.credentials
    .get({
      publicKey: {
        challenge: new Uint8Array(32), // Normally from server
        timeout: 60000,
        allowCredentials: [
          {
            type: "public-key",
            id: base64ToArrayBuffer(storedId),
            transports: ["internal"],
          },
        ],
        userVerification: "preferred",
      },
    })
    .then((assertion) => {
      document.getElementById("status").innerText =
        "Biometric authentication successful!";
    })
    .catch((err) => {
      console.error("Biometric authentication failed:", err);
      document.getElementById("status").innerText =
        "Biometric authentication failed.";
    });
}

// function triggerBiometricAuthentication() {
//   if (navigator.credentials && navigator.credentials.get) {
//     navigator.credentials
//       .get({
//         publicKey: {
//           challenge: new Uint8Array(32), // Dummy challenge; should ideally come from your server
//           timeout: 60000,
//           allowCredentials: [
//             {
//               id: new Uint8Array([1, 2, 3, 4]).buffer, // Placeholder ID (normally you'd store this after registration)
//               type: "public-key",
//               transports: ["internal"], // platform authenticator like fingerprint, Face ID
//             },
//           ],
//           userVerification: "preferred",
//         },
//       })
//       .then((credential) => {
//         document.getElementById("status").innerText =
//           "Biometric authentication successful!";
//       })
//       .catch((err) => {
//         console.error("Biometric auth error:", err);
//         document.getElementById("status").innerText =
//           "Biometric authentication failed!";
//       });
//   } else {
//     document.getElementById("status").innerText =
//       "Biometric authentication is not supported on this device.";
//   }
// }

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
