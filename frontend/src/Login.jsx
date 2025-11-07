import React, { useState } from "react";
import styles from "./Login.module.css";
import Logo from "./assets/Logo.png";
import GoogleIcon from "./assets/google.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Login() {
  // set up for later redirection
  const navigate = useNavigate();
  // get setUser function from auth context to update logged-in user
  const { setUser } = useAuth();

  // set up variables and the setter functions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      // targets the backend
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/auth/google/url`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      // redirect to google's sign-in page
      window.location.href = data.url;
    } catch (error) {
      console.error("error fetching google auth url:", error);
    }
  };

  const handleSubmit = async (e) => {
    // prevent default behavior of reloading the page for form submission
    e.preventDefault();

    // clear any error message first
    setError("");

    // field validation separate from backend
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // set loading to true
    setLoading(true);

    // try to login the user
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/login/email`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // fetch the user profile to update auth context
        const profileResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          credentials: "include",
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setUser(userData); // update auth context with user data
        }

        // redirect to dashboard on success
        navigate("/dashboard");
      } else {
        // show error message from backend
        setError(data || "Login failed");
      }
    } catch (err) {
      console.error("login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-page"]}>
      {/* ฝั่งซ้าย */}
      <div className={styles["login-left"]}>
        <div className={styles["logo"]}>
          <img src={Logo} alt="logo" />
          <h1>Porterest</h1>
        </div>
        <p className={styles["tagline"]}>Login to the world of creativity</p>

        <div className={styles["image-grid"]}>
          {[...Array(15)].map((_, i) => (
            <div className={styles["img-box"]} key={i}>
              <img
                src={`https://picsum.photos/300/${200 + (i % 5) * 40}?random=${i}`}
                alt={`random-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div className={styles["login-right"]}>
        <div className={styles["login-box"]}>
          <h2 className={styles["title"]}>Portable Interest</h2>

          {/* if error variable is not empty, then show the error */}
          {error && <div className={styles["error-message"]}>{error}</div>}

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
            <div className={styles["field"]}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <a href="#" className={styles["forgot"]}>
              Forgot password?
            </a>
            <button type="submit" className={styles["btn-primary"]} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles["signup-link"]}>
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className={styles["divider"]}>or</div>

          <button className={styles["google-btn"]} onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt="google" className={styles["google-icon"]} />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
