// src/pages/WelcomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css-modules/WelcomePage.module.css";
import logo from "../assets/winrock-international-logo.png";

export default function WelcomePage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You could also persist company/role here before navigating
    navigate("/login");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top blue bar */}
      

      <header className={styles.header}>
        {/* Update the `src` path or import if your logo is in `src/assets` */}
        <img
          src= {logo}
          alt="Winrock Logo"
          className={styles.logo}
        />
        
      </header>

      {/* Centered card */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.welcomeTitle}>Welcome back</h2>
          <p className={styles.welcomeSubtitle}>
            Please enter your detail to sign in.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label htmlFor="company" className={styles.label}>
                Company name
              </label>
              <input
                id="company"
                type="text"
                className={styles.input}
                placeholder=""
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="role" className={styles.label}>
                What is your role?
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="role"
                  className={styles.select}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">I am a…</option>
                  <option value="Client">Client</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Winrock Employee">Winrock Employee</option>
                </select>
                <svg
                  className={styles.selectIcon}
                  width="13"
                  height="8"
                  viewBox="0 0 13 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 0.75L6.5 6.25L12 0.75"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className={styles.nextButton}
              disabled={!company || !role}
            >
              Next
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
