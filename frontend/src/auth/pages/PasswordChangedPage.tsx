import { Link } from "react-router-dom";
import backArrow from "../../assets/arrow-left.svg";
import successIcon from "../../assets/success.png";
import styles from "../css-modules/ForgotFlow.module.css";

import AuthLogoHeader from "../components/AuthLogoHeader";

export default function PasswordChangedPage() {
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
