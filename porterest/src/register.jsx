import React from "react";
import "./register.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Welcome to Porterest</h2>
        <form className="form">
          <div className="field">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="********" />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" placeholder="********" />
          </div>
          <div className="field">
            <label>Role</label>
            <select>
              <option>Student</option>
              <option>Viewer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
