import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../../../../auth/authService";
import { toReadableError } from "../../../../types/Result";
import "../../../../auth/styles/ForgotPasswordPage.css";

import TextField from "../../../../auth/components/TextField";
import BottomLink from "../../../../auth/components/BottomLink";
import PasswordResetSentPage from "./PasswordResetSent";
import TitleHeader from "../../../../auth/components/TitleHeader";
import BackButton from "../../../../auth/components/BackButton";
import NextButton from "../../../../auth/components/NextButton";
import ToastMessage from "../../../../auth/components/ToastMessage";

import styles from "../../css-modules/LoginPopup.module.css";

interface ForgotPasswordProps {
  onBack: () => void;
}

function ForgotPassword({ onBack }: ForgotPasswordProps) {
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
    } else {
      console.error("Error sending password reset link: ", result.errorCode);
      setErrorMessage(toReadableError(result.errorCode));
    }
  }

  if (linkIsSent) {
    return (
      <PasswordResetSentPage
        email={email}
        setEmail={setEmail}
        setLinkIsSent={setLinkIsSent}
        onBack={onBack}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className="forgot-password-form-container">
        {errorMessage &&
            <ToastMessage
              message={errorMessage}
              isError={true}
            />}

        <BackButton onClick={onBack} />

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
  );
}

export default ForgotPassword;