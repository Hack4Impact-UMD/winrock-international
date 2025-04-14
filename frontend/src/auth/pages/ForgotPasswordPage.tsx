import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetLink } from "../authService";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSendLink() {
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
        backLink="/login"
        nextLabel="Send Link"
        onNext={handleSendLink}
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