import { useNavigate } from "react-router-dom";
import successIcon from "../../assets/success.png";
import "../../../../auth/styles/PasswordChangedPage.css";

import NextButton from "../../../../auth/components/NextButton";
import LogoHeader from "../../../../auth/components/LogoHeader";
import TitleHeader from "../../../../auth/components/TitleHeader";

const PasswordChangedPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <LogoHeader />

            <div className="page-container">
            <div className="password-changed-form-container">
                <img
                    src={successIcon}
                    alt="Success"
                    className="success-icon"
                />

                <TitleHeader
                    title="Password Changed!"
                    subtitle="Your password has been changed successfully."
                    subtitleColor="gray"
                />

                <NextButton
                    label="Back to login"
                    onClick={() => navigate("/auth/login")}
                />
            </div>
            </div>
        </>
    );
}

export default PasswordChangedPage;