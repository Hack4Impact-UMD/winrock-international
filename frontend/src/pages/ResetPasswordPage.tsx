// src/pages/ResetPasswordPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css-modules/ForgotFlow.module.css";
import logo from "../assets/winrock-international-logo.png";
import backArrow from "../assets/arrow-left.svg";

export default function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const canSubmit = pw.length >= 8 && pw === confirm;

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

          <h2 className={styles.title}>Create a new password</h2>
          <p className={styles.subtitle}>
            Your password must be at least 8 characters.
          </p>

          <div className={styles.form}>
            <div className={styles.fieldGroup}>
              <input
                id="new-pw"
                type="password"
                className={styles.input}
                placeholder="New Password"
                value={pw}
                onChange={e => setPw(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <input
                id="confirm-pw"
                type="password"
                className={styles.input}
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>
          </div>
            <div> <p></p></div>
            <button
            className={`${styles.button} ${styles.resetButton}`}
            disabled={!canSubmit}
            onClick={() => navigate("/forgot-password/success")}
          >
            Reset Password
          </button>
        </div>
      </main>
    </div>
  );
}
