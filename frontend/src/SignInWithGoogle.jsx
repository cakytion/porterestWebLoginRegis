import React from "react";

export default function SignInWithGoogle() {
  async function handleGoogle() {
    try {
      // Ask backend for an auth URL (backend should set state/code_verifier cookie)
      const res = await fetch("/auth/google", { method: "GET", credentials: "include" });

      // backend may redirect directly or return a JSON { url: '...' }
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      const json = await res.json().catch(() => null);
      if (json && json.url) {
        window.location.href = json.url;
        return;
      }

      console.error("Unexpected response from /auth/google", res.status, json);
      alert("Unable to start Google sign-in.");
    } catch (err) {
      console.error("Google signin error", err);
      alert("Network error while starting Google sign-in.");
    }
  }

  return (
    <button onClick={handleGoogle} className="btn-google">
      Sign in with Google
    </button>
  );
}
