import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import outlookLogo from "../../assets/Outlook-logo.png"
import Result from "../../types/Result";
import { handleLogin } from "../auth";
import styles from "../css-modules/LoginPage.module.css"; 

import AuthLogoHeader from "../components/AuthLogoHeader";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleOpenSignupPortal() {
    navigate("/signup");
  }

  async function handleLoginClick() {
    const result: Result = await handleLogin({ email, password });
    if (result.success) {
      navigate("/dashboard");
    } else {
      console.error("Error code: ", result.errorCode);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <AuthLogoHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <button className={styles.outlookButton}>
            Continue with Outlook
            <img src={outlookLogo} alt="Outlook icon" className={styles.outlookIcon} /> 
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.signInEmailLabel}>
            Sign in with email
          </div>

          <form className={styles.form}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your company email"
              autoComplete="on"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>

            <button
              className={styles.loginButton}
              disabled={!email || !password}
              onClick={async () => await handleLoginClick()}
            >
              Login
            </button>
          </form>

          <button
            className={styles.signup}
            onClick={handleOpenSignupPortal}
          >
            Sign up with new account →
          </button>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;