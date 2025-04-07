import React from "react";
import styles from "../css-modules/LoginPage.module.css"; 
import logo from "../assets/winrock-international-logo.png"
import outlook from "../assets/Outlook-logo.png"
import { Link } from "react-router-dom";

// Adjust this path if needed

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Thin blue bar at the top */}
     

      {/* White header area with logo and title */}
      <header className={styles.header}>
        {/* Update the `src` path or import if your logo is in `src/assets` */}
        <img
          src= {logo}
          alt="Winrock Logo"
          className={styles.logo}
        />
        
      </header>

      {/* Main content: centered card */}
      <main className={styles.main}>
        <div className={styles.card}>
          {/* Outlook button */}
          <button className={styles.outlookButton}>
            
            Continue with Outlook
            <img src={outlook} alt="Outlook icon" className={styles.outlookIcon} /> 
            {/* If you have an Outlook icon, you can place an <img> here */}
            {/* <img src="/assets/outlook-icon.png" alt="Outlook icon" className={styles.outlookIcon} /> */}
          </button>

          {/* OR divider */}
          {/* Replace your divider with this: */}
<div className={styles.divider}>
  <span>OR</span>
</div>


          {/* "Sign in with email" label */}
          <div className={styles.signInEmailLabel}>Sign in with email</div>

          {/* Email/Password Form */}
          <form className={styles.form}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your company email"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />

<Link to="/forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </Link>

            {/* Login button */}
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>

          {/* Sign up link/button */}
          <Link to="/signup" className={styles.signup}>
          Sign up with new account →
        </Link>

          
        </div>
      </main>
    </div>
  );
}
