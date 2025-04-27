import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../authService";
import "../styles/PasswordResetSentPage.css";

import LogoHeader from "../components/LogoHeader";
import TitleHeader from "../components/TitleHeader";
import BackButton from "../components/BackButton";
import NextButton from "../components/NextButton";
import BottomLink from "../components/BottomLink";
import ToastMessage from "../components/ToastMessage";

interface PasswordResetSentPageProps {
    email: string;
    setLinkIsSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordResetSentPage: React.FC<PasswordResetSentPageProps> = ({ email, setLinkIsSent }) => {
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<string>("");
  const [enableResend, setEnableResend] = useState(true);

  return (
    <>
      <LogoHeader />

      <div className="page-container">
      <div className="password-reset-form-container">
        {toastMessage &&
          <ToastMessage message={toastMessage} />}

        <BackButton onClick={() => setLinkIsSent(false)} />

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
    </>
  )
}

export default PasswordResetSentPage;