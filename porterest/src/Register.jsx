import React from "react";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className={styles["register-page"]}>
      <div className={styles["register-box"]}>
        <h2>Welcome to Porterest</h2>
        <form className={styles["form"]}>
          <div className={styles["field"]}>
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className={styles["field"]}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className={styles["field"]}>
            <label>Password</label>
            <input type="password" placeholder="********" />
          </div>
          <div className={styles["field"]}>
            <label>Confirm Password</label>
            <input type="password" placeholder="********" />
          </div>
          <div className={styles["field"]}>
            <label>Role</label>
            <select>
              <option>Student</option>
              <option>Viewer</option>
            </select>
          </div>
          <button type="submit" className={styles["btn-primary"]}>Register</button>
        </form>

        <p className={styles["signup-link"]}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
