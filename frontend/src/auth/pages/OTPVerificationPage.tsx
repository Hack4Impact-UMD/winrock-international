import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "../../assets/arrow-left.svg";
import styles from "../css-modules/ForgotFlow.module.css";

import AuthLogoHeader from "../components/AuthLogoHeader";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const onChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(-1);
    inputsRef.current[idx].value = val;
    if (val && idx < 3) inputsRef.current[idx + 1].focus();
  };

  return (
    <div className={styles.pageContainer}>
      <AuthLogoHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <Link to="/login">
            <img
              src={backArrow}
              alt="Back"
              className={styles.backIcon}
            />
          </Link>

          <h2 className={styles.title}>OTP Verification</h2>
          <p className={styles.subtitle}>
            Enter the 4 digit verification code we just sent to your email address.
          </p>

          <div className={styles.otpRow}>
            {[0,1,2,3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className={styles.otpInput}
                ref={el => { if(el) inputsRef.current[i] = el; }}
                onChange={(e) => onChange(i, e)}
              />
            ))}
          </div>

          <button
            className={styles.button}
            onClick={() => navigate("/forgot-password/reset")}
          >
            Verify
          </button>

          <div className={styles.footerLink}>
            Didn’t receive an email?
            <button
              style={{
                background:"none",
                border:"none",
                color:"var(--primary-blue)",
                cursor:"pointer",
                marginLeft:"4px"
              }}
              onClick={() => {/* TODO: resend code */}}
            >
              Resend
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
