import React from "react";
import { useAuth } from "./AuthContext";
import styles from "./Dashboard.module.css";

// NOTE: all this is just a temporary dashboard for now
// we'll need to handle role-based dashboard later too

export default function Dashboard() {
  // get user info and setter function from auth context
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/logout`;
      await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
      });
      // update global state var so the user logs out immediately via protected route redirect
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className={styles["dashboard-page"]}>
      <div className={styles["dashboard-header"]}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className={styles["logout-btn"]}>
          Logout
        </button>
      </div>

      <div className={styles["profile-card"]}>
        <img
          src={user.avatar_url}
          alt="Profile Avatar"
          referrerPolicy="no-referrer" // so we can retrieve images from google
        />
        <div className={styles["profile-info"]}>
          <p>
            <strong>Full Name:</strong> {user.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
