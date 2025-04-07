// src/pages/PasswordChangedPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../css-modules/ForgotFlow.module.css";
import logo from "../assets/winrock-international-logo.png";
import backArrow from "../assets/arrow-left.svg";
import successIcon from "../assets/success.png";

export default function PasswordChangedPage() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <img src={logo} alt="Winrock Logo" className={styles.logo} />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <Link to="/login">
            <img
              src={backArrow}
              alt="Back"
              className={styles.backIcon}
            />
          </Link>

          <img
            src={successIcon}
            alt="Success"
            style={{ width: "80px", margin: "0 auto 24px" }}
          />

          <h2 className={styles.title}>Password Changed!</h2>
          <p className={styles.subtitle}>
            Your password has been changed successfully.
          </p>

          <Link to="/login">
            <button className={styles.button}>
              Back to login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
