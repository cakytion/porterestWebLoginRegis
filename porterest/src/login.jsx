import React from "react";
import "./login.css";
import Logo from "./assets/Logo.png";
import GoogleIcon from "./assets/google.jpg";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login-page">
      {/* ฝั่งซ้าย */}
      <div className="login-left">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <h1>Porterest</h1>
        </div>
        <p className="tagline">Login to the world of creativity</p>

        <div className="image-grid">
        {[...Array(15)].map((_, i) => (
          <div className="img-box" key={i}>
            <img
              src={`https://picsum.photos/300/${200 + (i % 5) * 40}?random=${i}`}
              alt={`random-${i}`}
            />
          </div>
        ))}
      </div>

      </div>

      {/* ฝั่งขวา */}
      <div className="login-right">
        <div className="login-box">
          <h2 className="title">Portable Interest</h2>

          <form className="form">
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="********" />
            </div>
            <a href="#" className="forgot">Forgot password?</a>
            <button type="submit" className="btn-primary">Login</button>
          </form>

          <p className="signup-link">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className="divider">or</div>

          <button className="google-btn">
            <img src={GoogleIcon} alt="google" className="google-icon" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
