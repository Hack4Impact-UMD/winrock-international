import { useState } from "react";
import "../styles/CreateNewPasswordPage.css";

import LogoHeader from "../components/LogoHeader";
import NextButton from "../components/NextButton";
import TitleHeader from "../components/TitleHeader";
import PasswordField from "../components/PasswordField";
import ToastMessage from "../components/ToastMessage";
import { useNavigate } from "react-router-dom";

const MIN_PASSWORD_LENGTH = 8;

const CreateNewPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    function handleResetPasswordClick() {
        if (!password) {
            setErrorMessage("Missing password");
            return;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        // TODO: Reset the password, nothing here yet since the page is not currently in use

        navigate("/auth/password-changed");
    }

    return (
        <>
            <LogoHeader />

            <div className="page-container">
            <div className="create-new-password-form-container">
                {errorMessage &&
                    <ToastMessage
                        message={errorMessage}
                        isError={true}
                    />}

                <TitleHeader
                    title="Create a new password"
                    subtitle="Your password must be at least 8 characters."
                    textAlign="left"
                    subtitleColor="gray"
                />

                <PasswordField
                    placeholder="New Password"
                    onChange={(value) => {
                        setPassword(value);
                        setErrorMessage("");
                    }}
                />

                <PasswordField
                    placeholder="Confirm Password"
                    onChange={(value) => {
                        setConfirmPassword(value);
                        setErrorMessage("");
                    }}
                />

                <NextButton
                    label="Reset Password"
                    onClick={handleResetPasswordClick}
                />
            </div>
            </div>
        </>
    );
}

export default CreateNewPasswordPage;