import React from "react";
import styles from "../css-modules/LoginPage.module.css";
import logo from '../assets/winrock-international-logo.png';


export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        {/* Replace src with your actual logo path */}
        <img 
          src={logo}
          alt="Winrock Logo" 
          className={styles.logo}
        />
        <div className={styles.loginActions}>
          <button className={styles.headerBtn}>Login</button>
          <button className={styles.headerBtn}>Login</button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Left Section: Outlook Login */}
        <div className={styles.outlookSection}>
          <div className={styles.outlookBox}>
            <p className={styles.outlookText}>Sign in with Outlook</p>
          </div>
        </div>

        {/* Right Section: Email Login */}
        <div className={styles.emailSection}>
          <h2 className={styles.emailTitle}>Sign in with Email</h2>
          <form className={styles.form}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          <button className={styles.signupButton}>
            Sign up with new account →
          </button>
        </div>
      </div>
    </div>
  );
}
