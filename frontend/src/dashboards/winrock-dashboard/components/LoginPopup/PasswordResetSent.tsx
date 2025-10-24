import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../../../../auth/authService";
import "../../../../auth/styles/PasswordResetSentPage.css";

import BottomLink from "../../../../auth/components/BottomLink";
import NextButton from "../../../../auth/components/NextButton";
import ToastMessage from "../../../../auth/components/ToastMessage";
import TitleHeader from "../../../../auth/components/TitleHeader";
import BackButton from "../../../../auth/components/BackButton";

import styles from "../../css-modules/LoginPopup.module.css";

interface PasswordResetSentPageProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setLinkIsSent: React.Dispatch<React.SetStateAction<boolean>>;
    onBack: () => void;
}

const PasswordResetSentPage: React.FC<PasswordResetSentPageProps> = ({ email, setEmail, setLinkIsSent }) => {
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<string>("");
  const [enableResend, setEnableResend] = useState(true);

  return (
    <div className={styles.pageContainer}>
      <div className="password-reset-form-container">
        {toastMessage &&
          <ToastMessage message={toastMessage} />}

        <BackButton onClick={() => {
          setLinkIsSent(false);
          setEmail("");
        }} />

        <TitleHeader
          title="Email has been sent!"
          subtitle="Please check inbox and click in the received link to reset password."
          textAlign="left"
          subtitleColor="gray"
        />

        <NextButton
          label="Log in"
          onClick={() => navigate("/auth/login")}
        />

        <BottomLink
          beforeText="Not received?"
          actionLabel="Resend"
          onClick={() => {
            if (!enableResend) {
              return;
            }
            setEnableResend(false);

            sendPasswordResetLink(email);
            setToastMessage("We've resent the password reset link. Please check your inbox.")
            
            // Throttle the password resend to prevent API flooding 
            setTimeout(() => { setEnableResend(true); }, 10000);
          }}
        />
      </div>
    </div>
  )
}

export default PasswordResetSentPage;