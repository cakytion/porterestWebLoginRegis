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
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="Your name" />
          </div>
          <div className={styles["field"]}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className={styles["field"]}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="********" />
          </div>
          <div className={styles["field"]}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" placeholder="********" />
          </div>
          <div className={styles["field"]}>
            <label htmlFor="role">Role</label>
            <select id="role">
              <option>Student</option>
              <option>Viewer</option>
            </select>
          </div>
          <button type="submit" className={styles["btn-primary"]}>
            Register
          </button>
        </form>

        <p className={styles["signup-link"]}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
