import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backArrow from "../../assets/arrow-left.svg";
import outlookLogo from "../../assets/Outlook-logo.png";
import Result from "../../types/Result";
import { type Role, handleSignup } from "../auth";
import styles from "../css-modules/SignUpPage.module.css";

import AuthLogoHeader from "../components/AuthLogoHeader";

function SignupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | "">("");
  const [company, setCompany] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function goNextStep() {
    setStep(step + 1);
  }

  async function handleSignupClick() {
    if (role === "") return;

    const result: Result = await handleSignup({ email, password, firstName, lastName, role, company})
    if (result.success) {
      navigate("/dashboard");
    } else {
      console.error("Error code: ", result.errorCode);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <AuthLogoHeader />

      <main className={step === 2 ? styles.mainStep2 : styles.main}>
        
        {step === 1 && (
          <div className={styles.card}>
            <Link to="/login" className={styles.backLink}>
              <img src={backArrow} alt="Back" className={styles.backIcon} />
            </Link>

            <h2 className={styles.title}>Create Your Account</h2>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>What is your role?</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={role}
                  onChange={(e) => {
                    const roleValue = e.target.value as Role;
                    setRole(e.target.value as Role);
                    if (roleValue === "admin") {
                      setCompany("");
                    }
                  }}
                >
                  <option value="" disabled>Select a role</option>
                  <option value="client">Client</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Winrock International</option>
                </select>
                <svg
                  className={styles.selectIcon}
                  width="13" height="8"
                  viewBox="0 0 13 8" fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 0.75L6.5 6.25L12 0.75" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            { (role === "client" || role === "supplier") &&
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Your Company Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            }

            <button
              className={styles.continueButton}
              disabled={!role}
              onClick={goNextStep}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <>
          <button className={styles.outlookButton}>
          Continue with Outlook
          <img src={outlookLogo} alt="Outlook" className={styles.outlookIcon} />
        </button>
            <div className={styles.card}>
              <div
                className={styles.backLink}
                onClick={() => setStep(1)}
              >
                <img src={backArrow} alt="Back" className={styles.backIcon} />
              </div>

              <h2 className={styles.title}>Create Your Account</h2>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>First Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Last Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  className={styles.input}
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.footerContinue}>
              <button
                className={styles.continueButton}
                disabled={
                  !firstName || !lastName || !email || !password
                }
                onClick={async () => await handleSignupClick()}
              >
                Continue
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SignupPage;