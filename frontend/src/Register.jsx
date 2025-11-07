import React, { useState } from "react";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Register() {
  // set up for later redirection
  const navigate = useNavigate();
  // get setUser function from auth context to update logged-in user
  const { setUser } = useAuth();

  // set up variables and the setter functions
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    // prevent default behavior of reloading the page for form submission
    // e is the event object
    e.preventDefault();

    // clear any error message first
    setError("");

    // field validation separate from backend
    if (!name || !email || !password || !confirmPassword) {
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

    // first set loading to true
    setLoading(true);

    // we'll try to register the user
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/register/email`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // fetch the user profile to update auth context
        const profileResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          credentials: "include", // send session cookie
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setUser(userData); // update auth context with user data
        }

        // redirect to dashboard on success
        navigate("/dashboard");
      } else {
        // show error message from backend
        setError(data || "Registration failed");
      }
    } catch (err) {
      console.error("registration error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["register-page"]}>
      <div className={styles["register-box"]}>
        <h2>Welcome to Porterest</h2>
        {/* if error variable is not empty, then show the error */}
        {error && <div className={styles["error-message"]}>{error}</div>}
        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["field"]}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name} // the value shown in the field, will come from the name variable
              onChange={(e) => setName(e.target.value)} // when user types, update the variable with the value
              disabled={loading} // if loading is true, user can't type
              // the user types, name variable updates, and the value is then used to show in the field
            />
          </div>
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
          <div className={styles["field"]}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button type="submit" className={styles["btn-primary"]} disabled={loading}>
            {
              loading
                ? "Registering..."
                : "Register" /* changes content of button on loading state */
            }
          </button>
        </form>

        <p className={styles["signup-link"]}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
