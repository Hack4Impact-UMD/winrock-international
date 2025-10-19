import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

import Result, { toReadableError } from "../../../types/Result"
import { handleLogin } from "../../../auth/authService";

import "../../../auth/styles/LoginPage.css";

import LogoHeader from "../../../auth/components/LogoHeader";
import OutlookButton from "../../../auth/components/OutlookButton";
import Divider from "../../../auth/components/Divider";
import TextField from "../../../auth/components/TextField";
import PasswordField from "../../../auth/components/PasswordField";
import BottomLink from "../../../auth/components/BottomLink";
import NextButton from "../../../auth/components/NextButton";
import ToastMessage from "../../../auth/components/ToastMessage";

import styles from "../css-modules/LoginPopup.module.css";


// TODO IDK IF THIS IS THE RIGHT APPROACH 
import { useNavigate } from "react-router-dom";

interface LoginPopupProps {
  onClose: () => void;
  isExistingUser: boolean;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose, isExistingUser }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLoginClick() {
    if (!email) {
      setErrorMessage("Missing email.");
      return;
    }

    const result: Result = await handleLogin({ email, password });
    if (result.success) {
      // TODO close the popup and do other necessary stuff
      onClose();
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

          <PasswordField
            label="Password"
            toggleHidden={true}
            linkLabel="Forgot password?"
            link="/auth/forgot-password"
            onChange={(value) => {
              setErrorMessage("");
              setPassword(value)
            }}
          />

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
            onClick={() => navigate("/auth/signup")}
          />
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginPopup;
