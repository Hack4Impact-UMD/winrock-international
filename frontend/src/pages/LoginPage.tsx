import React from "react";
import styles from "../css-modules/LoginPage.module.css";


const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div data-layer="Stage 1: Supplier Onboarding" className={styles.stageTitle}>
        Stage 1: Supplier Onboarding
      </div>
      <div data-layer="Returning → Login Screen" className={styles.subtitle}>
        Returning → Login Screen
      </div>
      <div data-layer="Sign in with Google" className={styles.googleText}>
        Sign in with Google
      </div>
      <div data-layer="Sign in with email address" className={styles.signinEmailText}>
        Sign in with email address
      </div>
      <div data-layer="Email" className={styles.emailLabel}>
        Email
      </div>
      <div data-layer="Password" className={styles.passwordLabel}>
        Password
      </div>
      <div data-layer="OR" className={styles.divider}>
        OR
      </div>
      <div data-layer="Sign up with new account" className={styles.signup}>
        <span className={styles.signupPrimary}>Sign up</span>
        <span className={styles.signupSecondary}> with new account</span>
      </div>
      <div data-layer="Rectangle 126" className={styles.backgroundRectangle}></div>
      <div data-layer="Rectangle 128" className={styles.inputRectangle1}></div>
      <div data-layer="Rectangle 129" className={styles.inputRectangle2}></div>
      <div data-layer="Rectangle 130" className={styles.inputRectangle3}></div>
      <div data-svg-wrapper data-layer="Vector 34" className={styles.verticalLine}>
        <svg width="2" height="25" viewBox="0 0 2 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 0V25" stroke="black" />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
