import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../authService";
import { toReadableError } from "../../types/Result";
import "../styles/ForgotPasswordPage.css";

import LogoHeader from "../components/LogoHeader";
import TextField from "../components/TextField";
import BottomLink from "../components/BottomLink";
import PasswordResetSentPage from "./PasswordResetSentPage";
import TitleHeader from "../components/TitleHeader";
import BackButton from "../components/BackButton";
import NextButton from "../components/NextButton";
import ToastMessage from "../components/ToastMessage";

function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [linkIsSent, setLinkIsSent] = useState(false);

  const navigate = useNavigate();

  async function handleSendLink() {
    if (!email) {
      setErrorMessage("Missing email");
      return;
    }
    
    const result = await sendPasswordResetLink(email);
    if (result.success) {
      setLinkIsSent(true);
      setEmail("");
    } else {
      console.error("Error sending password reset link: ", result.errorCode);
      setErrorMessage(toReadableError(result.errorCode));
    }
  }

  if (linkIsSent) {
    return (
      <PasswordResetSentPage
        email={email}
        setLinkIsSent={setLinkIsSent}
      />
    );
  }

  return (
    <>
      <LogoHeader />

      <div className="page-container">
      <div className="forgot-password-form-container">
        {errorMessage &&
            <ToastMessage
              message={errorMessage}
              isError={true}
            />}

        <BackButton onClick={() => navigate("/auth/login")} />

        <TitleHeader
          title="Forgot password?"
          subtitle="Don't worry! It occurs. Please enter the email address linked with your account."
          textAlign="left"
          subtitleColor="gray"
        />

        <TextField
          placeholder="Enter your email"
          onChange={(value) => {
            setEmail(value);
            setErrorMessage("");
          }}
        />

        <NextButton
          label="Send Link"
          onClick={handleSendLink}
        />

        <BottomLink
          beforeText="Remember password?"
          actionLabel="Sign in"
          onClick={() => navigate("/auth/login")}
        />
      </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;