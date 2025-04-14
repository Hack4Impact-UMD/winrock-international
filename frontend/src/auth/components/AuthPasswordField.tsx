import { useState } from "react";
import styles from "../css-modules/AuthPasswordField.module.css";
import { Link } from "react-router-dom";
import toggleHiddenIcon from "../../assets/toggle-hidden.png";

interface AuthPasswordFieldProps {
    label: string;
    autoComplete?: boolean;
    toggleHidden?: boolean;
    linkLabel?: string;
    link?: string;
    onChange: (value: string) => void;
}

function AuthPasswordField({ label, autoComplete, toggleHidden=false, onChange, linkLabel, link }: AuthPasswordFieldProps) {
    const [isHidden, setIsHidden] = useState(true);

    return (
        <div className={styles.fieldContainer}>
            <p className={styles.label}>
                {label}
            </p>
            <form className={styles.inputContainer}>
                <input
                    className={styles.input}
                    type={isHidden ? "password" : "text"}
                    autoComplete={autoComplete ? "on" : "off"}
                    onChange={(e) => onChange(e.target.value)}
                />
                {toggleHidden &&
                    <img
                        src={toggleHiddenIcon}
                        alt="Unhide"
                        className={styles.toggleHiddenIcon}
                        onClick={() => setIsHidden(!isHidden)}
                    />}
            </form>
            {linkLabel && link &&
                <Link to={link} className={styles.link}>
                    {linkLabel}
                </Link>}
        </div>
    )
}

export default AuthPasswordField;