import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  // initializes state variables and setter functions
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // prevent default behavior of reloading the page for form submission
    // e is the event object
    e.preventDefault();

    setError("");
    setSuccess("");

    // field validation
    if (!email) {
      setError("Email is required");
      return;
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      // call backend with email
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/password-reset/request`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("The reset link has been sent");
        setEmail("");
      } else {
        setError(data || "Failed to send reset link");
      }
    } catch (err) {
      console.error("forgot password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["forgot-page"]}>
      <div className={styles["forgot-box"]}>
        <h2 className={styles["title"]}>Forgot Password?</h2>
        <p className={styles["subtitle"]}>Enter your email to receive a password reset link</p>

        {error && <div className={styles["error-message"]}>{error}</div>}
        {success && <div className={styles["success-message"]}>{success}</div>}

        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["field"]}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles["btn-primary"]} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className={styles["auth-link"]}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
