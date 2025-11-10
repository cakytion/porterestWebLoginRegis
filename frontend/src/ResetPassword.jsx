import React, { useState, useEffect } from "react";
import styles from "./ResetPassword.module.css";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function ResetPassword() {
  // set up for later redirection
  const navigate = useNavigate();

  // just get parameter object from url query strings
  const [searchParams] = useSearchParams();

  // get the token query parameter
  const token = searchParams.get("token");

  // initializes state variables and setter functions
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // runs the if statement whenever token changes
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    // prevent default behavior of reloading the page for form submission
    // e is the event object
    e.preventDefault();

    setError("");

    // field validation
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // call backend with token and new password
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/password-reset/confirm`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // logs out the user
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
          method: "POST",
          credentials: "include",
        });

        // redirect to login after success
        navigate("/login", { state: { message: "Password reset successfully. Please log in." } });
      } else {
        setError(data || "Failed to reset password");
      }
    } catch (err) {
      console.error("reset password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // if no token, show error message
  if (!token) {
    return (
      <div className={styles["reset-page"]}>
        <div className={styles["reset-box"]}>
          <h2 className={styles["title"]}>Invalid Reset Link</h2>
          {error && <div className={styles["error-message"]}>{error}</div>}
          <p className={styles["auth-link"]}>
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["reset-page"]}>
      <div className={styles["reset-box"]}>
        <h2 className={styles["title"]}>Reset Password</h2>

        {error && <div className={styles["error-message"]}>{error}</div>}

        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["field"]}>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles["field"]}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles["btn-primary"]} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className={styles["auth-link"]}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
