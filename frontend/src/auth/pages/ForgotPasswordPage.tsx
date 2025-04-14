import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../authService";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";
import AuthBottomLink from "../components/AuthBottomLink";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSendLink() {
    if (!email) {
      console.error("Error sending password reset link: Missing email");
      return;
    }
    
    const result = await sendPasswordResetLink(email);
    if (result.success) {
      navigate("/forgot-password/reset");
    } else {
      console.error("Error sending password reset link: ", result.errorCode);
    }
  }

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        title="Forgot password?"
        subtitle="Don't worry! It occurs. Please enter the email address linked with your account."
        titleStyle={2}
        onBack={() => navigate("/login")}
        nextLabel="Send Link"
        onNext={handleSendLink}
        afterChild={
          <AuthBottomLink
            beforeText="Remember password?"
            linkLabel="Sign in"
            link="/login"
          />
        }
        remSpacing={[10, 8, 2.5, 12, 3]}
      >
        <>
          <AuthTextField
            placeholder="Enter your email"
            onChange={(value) => setEmail(value)}
          />
        </>
      </AuthForm>
    </>
  )
}

export default ForgotPasswordPage;