import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleSendLink() {
    console.log("Reset code sent to", email);
    navigate("/forgot-password/verify");
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