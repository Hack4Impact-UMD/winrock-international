// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../css-modules/ForgotFlow.module.css";
import logo from "../assets/winrock-international-logo.png";
import backArrow from "../assets/arrow-left.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset code sent to", email);
    navigate("/forgot-password/verify");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <img src={logo} alt="Winrock Logo" className={styles.logo} />
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Back arrow now a Link */}
          <Link to="/login">
            <img
              src={backArrow}
              alt="Back"
              className={styles.backIcon}
            />
          </Link>

          <h2 className={styles.title}>Forgot password?</h2>
          <p className={styles.subtitle}>
            Don’t worry! It occurs. Please enter the email address linked with your account.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reset-email" className={styles.label}>
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={!email}
            >
              Send code
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
