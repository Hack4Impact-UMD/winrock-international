import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Result, { toReadableError } from "../../../../types/Result"
import { handleLogin } from "../../../../auth/authService";
import { getSupplierProjectNameByToken, validateSupplierEmail } from "../../projects/winrockDashboardService";

import "../../../../auth/styles/LoginPage.css";

import OutlookButton from "../../../../auth/components/OutlookButton";
import Divider from "../../../../auth/components/Divider";
import TextField from "../../../../auth/components/TextField";
import PasswordField from "../../../../auth/components/PasswordField";
import BottomLink from "../../../../auth/components/BottomLink";
import NextButton from "../../../../auth/components/NextButton";
import ToastMessage from "../../../../auth/components/ToastMessage";
import SignUp from "./SignUp"; 
import ForgotPassword from "./ForgotPassword";

import styles from "../../css-modules/LoginPopup.module.css";

interface LoginPopupProps {
  onClose: () => void;
  supplierToken: string;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose, supplierToken }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<"login" | "signup" | "forgot_password">("login");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLoginClick() {
    if (!email) {
      setErrorMessage("Missing email.");
      return;
    }
    const emailResult: boolean = await validateSupplierEmail(supplierToken, email);
    if (!emailResult) {
      setErrorMessage("Unauthorized email.");
      return;
    }
    const result: Result = await handleLogin({ email, password });
    if (result.success) {
      onClose();
      const projectResult = await getSupplierProjectNameByToken(supplierToken);
      if (projectResult.success) {
        navigate(`/dashboard/admin/projects/${projectResult.data}`);
      } else {
        console.error("Error fetching project name: ", projectResult.errorCode);
        setErrorMessage("Login successful, but failed to retrieve project information.");
      }
    } else {
      console.error("Error logging in: ", result.errorCode);
      setErrorMessage(toReadableError(result.errorCode));
    }
  }

  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={popupRef}
        className={styles.popupContainer}
        onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
      {pageState === "login" &&
        <div className={styles.pageContainer}>
        <div className={styles.loginFormContainer}>
          {errorMessage &&
            <ToastMessage
              message={errorMessage}
              isError={true}
            />}

          <h1 className={styles.title}>Create an account or sign in to view content.</h1>

          <TextField
            label="Email"
            onChange={(value) => {
              setErrorMessage("");
              setEmail(value);
            }}
          />
          <div onClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setPageState("forgot_password");
          }}>
            <PasswordField
              label="Password"
              toggleHidden={true}
              linkLabel="Forgot password?"
              link="#"
              onChange={(value) => {
                setErrorMessage("");
                setPassword(value)
              }}
            />
          </div>

          <NextButton
            label="Login"
            onClick={handleLoginClick}
          />

          <Divider label="OR" />

          <OutlookButton
            label="Continue with Outlook"
            onClick={() => {return;}}
          />

          <BottomLink
            beforeText="Don't have an account yet?"
            actionLabel="Sign up"
            onClick={() => setPageState("signup")}
          />
        </div>
        </div>
      }
      {pageState === "signup" &&
        <SignUp supplierToken={supplierToken} onClose={onClose} />
      }
      {pageState === "forgot_password" &&
        <ForgotPassword onBack={() => setPageState("login")} />
      }
      </div>
    </div>,
    document.body
  );
};

export default LoginPopup;
