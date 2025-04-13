import { useNavigate } from "react-router-dom";
import successIcon from "../../assets/success.png";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";

function PasswordChangedPage() {
  const navigate = useNavigate();

  function handleBackToLogin() {
    navigate("/login");
  }

  return (
    <>
      <AuthLogoHeader />
      <AuthForm
        title="Password Changed!"
        subtitle="Your password has been changed successfully."
        nextLabel="Back to Login"
        onNext={handleBackToLogin}

        beforeChildren={<>
          <img
            src={successIcon}
            alt="Success"
            style={{ width: "80px", margin: "8rem auto -3rem" }}
          />
        </>}
      >
      </AuthForm>
    </>
  )
}

export default PasswordChangedPage;