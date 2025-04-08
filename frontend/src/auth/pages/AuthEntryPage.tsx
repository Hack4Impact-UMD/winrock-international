import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "../auth";
import styles from "../css-modules/WelcomePage.module.css";

import AuthLogoHeader from "../components/AuthLogoHeader";

function AuthEntryPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | "">("");
  const [company, setCompany] = useState<string>("");

  function handleNextClick(e: React.FormEvent) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className={styles.pageContainer}>
      <AuthLogoHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.welcomeTitle}>
            Welcome back
          </h2>
          <p className={styles.welcomeSubtitle}>
            Please enter your detail to sign in.
          </p>

          <form className={styles.form}>
          <div className={styles.fieldGroup}>
              <label htmlFor="role" className={styles.label}>
                What is your role?
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="role"
                  className={styles.select}
                  value={role}
                  onChange={(e) => {
                    const roleValue = e.target.value as Role;
                    setRole(roleValue);
                    if (roleValue === "admin") setCompany("");
                  }}
                >
                  <option value="" disabled>I am a…</option>
                  <option value="client">Client</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Winrock Employee</option>
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

            {(role === "client" || role === "supplier") &&
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
            }

            <button
              className={styles.nextButton}
              onClick={handleNextClick}
            >
              Next
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AuthEntryPage;