import React from "react";
import styles from "./Login.module.css";
import Logo from "./assets/Logo.png";
import GoogleIcon from "./assets/google.jpg";
import { Link } from "react-router-dom";

export default function Login() {
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

  return (
    <div className={styles['login-page']}>
      {/* ฝั่งซ้าย */}
      <div className={styles['login-left']}>
        <div className={styles['logo']}>
          <img src={Logo} alt="logo" />
          <h1>Porterest</h1>
        </div>
        <p className={styles['tagline']}>Login to the world of creativity</p>

        <div className={styles['image-grid']}>
          {[...Array(15)].map((_, i) => (
            <div className={styles['img-box']} key={i}>
              <img
                src={`https://picsum.photos/300/${200 + (i % 5) * 40}?random=${i}`}
                alt={`random-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div className={styles['login-right']}>
        <div className={styles['login-box']}>
          <h2 className={styles['title']}>Portable Interest</h2>

          <form className={styles['form']}>
            <div className={styles['field']}>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className={styles['field']}>
              <label>Password</label>
              <input type="password" placeholder="********" />
            </div>
            <a href="#" className={styles['forgot']}>
              Forgot password?
            </a>
            <button type="submit" className={styles['btn-primary']}>
              Login
            </button>
          </form>

          <p className={styles['signup-link']}>
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className={styles['divider']}>or</div>

          <button className={styles['google-btn']} onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt="google" className={styles['google-icon']} />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
