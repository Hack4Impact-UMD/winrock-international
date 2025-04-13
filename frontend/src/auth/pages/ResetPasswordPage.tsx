import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function handleResetPassword() {
    if (password.length < 8 || password !== confirmPassword) {
      return;
    }

    navigate("/forgot-password/success");
  }

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        title="Create a new password"
        subtitle="Your password must be at least 8 characters."
        nextLabel="Reset Password"
        onNext={handleResetPassword}
      >
        <>
          <AuthTextField
            placeholder="New Password"
            onChange={(value) => setPassword(value)}
          />

          <AuthTextField
            placeholder="Confirm Password"
            onChange={(value) => setConfirmPassword(value)}
          />
        </>
      </AuthForm>
    </>
  )
}

export default ResetPasswordPage;