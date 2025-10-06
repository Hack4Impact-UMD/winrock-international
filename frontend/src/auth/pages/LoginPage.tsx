import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Result, { toReadableError } from "../../types/Result";
import { handleLogin } from "../authService";
import "../styles/LoginPage.css"

import LogoHeader from "../components/LogoHeader";
import OutlookButton from "../components/OutlookButton";
import Divider from "../components/Divider";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import BottomLink from "../components/BottomLink";
import NextButton from "../components/NextButton";
import ToastMessage from "../components/ToastMessage";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLoginClick() {
    if (!email) {
      setErrorMessage("Missing email.");
      return;
    }

    const result: Result = await handleLogin({ email, password });
    if (result.success) {
      navigate("/dashboard/admin/projects");
    } else {
      console.error("Error logging in: ", result.errorCode);
      setErrorMessage(toReadableError(result.errorCode));
    }
  }

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && email && password) {
      e.preventDefault(); // Prevent default form submission
      await handleLoginClick();
    }
  }

  return (
    <>
      <LogoHeader />

      <div className="page-container">
      <div className="login-form-container">
        {errorMessage &&
          <ToastMessage
            message={errorMessage}
            isError={true}
          />}

        <OutlookButton
          label="Continue with Outlook"
          onClick={() => {return;}}
        />

        <Divider label="OR" />

        <div className="sign-in-with-email">
          Sign in with email
        </div>

        <TextField
          label="Email"
          onChange={(value) => {
            setErrorMessage("");
            setEmail(value);
          }}
          onKeyDown={handleKeyDown}
        />

        <PasswordField
          label="Password"
          toggleHidden={true}
          linkLabel="Forgot password?"
          link="/auth/forgot-password"
          onChange={(value) => {
            setErrorMessage("");
            setPassword(value)
          }}
          onKeyDown={handleKeyDown}
        />

        <NextButton
          label="Login"
          onClick={handleLoginClick}
        />

        <BottomLink
          beforeText="Don't have an account yet?"
          actionLabel="Sign up"
          onClick={() => navigate("/auth/signup")}
        />
      </div>
      </div>
    </>
  )
}

export default LoginPage;