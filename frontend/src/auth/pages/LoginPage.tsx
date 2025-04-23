import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Result from "../../types/Result";
import { handleLogin } from "../authService";

import AuthLogoHeader from "../components/AuthLogoHeader";
import AuthForm from "../components/AuthForm";
import AuthTextField from "../components/AuthTextField";
import AuthPasswordField from "../components/AuthPasswordField";
import OutlookButton from "../components/OutlookButton";
import Divider from "../components/Divider";
import AuthBottomLink from "../components/AuthBottomLink";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  async function handleLoginClick() {
    if (!email) {
      console.error("Error logging in: Missing email");
      return;
    }

    if (!password) {
      console.error("Error logging in: Missing password")
      return;
    }
    
    const result: Result = await handleLogin({ email, password });
    if (result.success) {
      navigate("/dashboard");
    } else {
      console.error("Error logging in: ", result.errorCode);
    }
  }

  return (
    <>
      <AuthLogoHeader />

      <AuthForm
        nextLabel="Login"
        onNext={handleLoginClick}
        afterChild={
          <AuthBottomLink
            beforeText="Don't have an account yet?"
            linkLabel="Sign up"
            link="/signup"
          />
        }
        remSpacing={[7, 3, 2.3, 6, 7.7, 2.7, 2.3, 3]}
      >
        <>
          <OutlookButton
            label="Continue with Outlook"
            onClick={() => {return;}}
          />

          <Divider label="OR" />

          <div style={{textAlign: "center", fontSize: ".95rem", color: "var(--color-primary)", letterSpacing: ".48px"}}>
            Sign in with email
          </div>

          <AuthTextField
            label="Email"
            onChange={(value) => setEmail(value)}
          />

          <AuthPasswordField
            label="Password"
            toggleHidden={true}
            linkLabel="Forgot password?"
            link="/forgot-password"
            onChange={(value) => setPassword(value)}
          />
        </>
      </AuthForm>
    </>
  )
}

export default LoginPage;