import React, { useState } from "react";
import styles from "./FinishSignup.module.css";

export default function FinishSignup() {
  // set state variable role to student, also get setter function
  const [role, setRole] = useState("student");

  const handleSubmit = async (e) => {
    // prevent default behavior of reloading the page for form submission
    // e is the event object
    e.preventDefault();
    try {
      // send role to the google-finalize endpoint
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/register/google-finalize`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }), // turn role state var into json string
      });

      if (response.ok) {
        // on success, the backend will set the session cookie
        // then we redirect to dashboard.
        window.location.href = "/dashboard";
      } else {
        console.error("Registration failed:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={styles["finish-signup-page"]}>
      <div className={styles["finish-signup-box"]}>
        <h2 className={styles["title"]}>One Last Step</h2>
        <p className={styles["subtitle"]}>Please select your role to complete your profile.</p>

        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["field"]}>
            <label htmlFor="role-select">I am a...</label>
            <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button type="submit" className={styles["btn-primary"]}>
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
