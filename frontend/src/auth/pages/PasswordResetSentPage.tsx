import { useNavigate } from "react-router-dom";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthBottomLink from "../components/AuthBottomLink";
import { sendPasswordResetLink } from "../authService";

interface PasswordResetSentPageProps {
    email: string;
    setLinkIsSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordResetSentPage: React.FC<PasswordResetSentPageProps> = ({ email, setLinkIsSent }) => {
  const navigate = useNavigate();

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        title="Email has been sent!"
        subtitle="Please check inbox and click in the received link to reset password."
        titleStyle={2}
        onBack={() => setLinkIsSent(false)}
        nextLabel="Login"
        onNext={() => navigate("/auth/login")}
        afterChild={
          <AuthBottomLink
            beforeText="Not received?"
            actionLabel="Resend"
            onClick={() => sendPasswordResetLink(email)}
          />
        }
        remSpacing={[10, 8, 2.5, 12, 3]}
       />
    </>
  )
}

export default PasswordResetSentPage;