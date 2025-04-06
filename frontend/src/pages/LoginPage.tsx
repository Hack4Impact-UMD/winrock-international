import React from "react";
import styles from "../css-modules/LoginPage.module.css";
import TitleHeader from "../components/TitleHeader";        // Adjust the path as needed
import SectionHeader from "../components/SectionHeader";    // Adjust the path as needed

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TitleHeader 
          title="Stage 1: Supplier Onboarding" 
          description="Returning → Login Screen" 
        />
      </div>

      <div className={styles.card}>
        <button className={styles.googleButton}>Sign in with Google</button>
        <div className={styles.divider}>OR</div>
        
        {/* Use SectionHeader only when you want a standardized section title */}
        <SectionHeader label="Sign in with email address" />
        
        <form className={styles.form}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </form>

        <button className={styles.signupButton}>
          Sign up with new account →
        </button>
      </div>
    </div>
  );
}
