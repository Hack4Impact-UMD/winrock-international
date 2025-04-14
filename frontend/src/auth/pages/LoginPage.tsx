import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Result from "../../types/Result";
import { handleLogin } from "../authService";
import styles from "../css-modules/LoginPage.module.css"; 

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";
import AuthPasswordField from "../components/AuthPasswordField";
import OutlookButton from "../components/OutlookButton";
import Divider from "../components/Divider";

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
      console.error("Error logging in: ", result.errorCode);
    }
  }

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        nextLabel="Login"
        onNext={handleLoginClick}
        afterChildren={
          <button
            className={styles.signup}
            onClick={handleOpenSignupPortal}
          >
            Sign up with new account →
          </button>
        }
      >
        <>
          <OutlookButton
            label="Continue with Outlook"
            onClick={() => {return;}}
          />

          <Divider label="OR" />

          <div className={styles.signInEmailLabel}>
            Sign in with email
          </div>

          <AuthTextField
            label="Email"
            onChange={(value) => setEmail(value)}
          />

          <AuthPasswordField
            label="Password"
            linkLabel="Forgot password?"
            link="/forgot-password"
            onChange={(value) => setPassword(value)}
          />
        </>
      </AuthForm>
    </>
  )
}

export default LoginPage;