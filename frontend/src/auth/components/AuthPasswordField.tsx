import { useState } from "react";
import styles from "../css-modules/AuthPasswordField.module.css";
import { Link } from "react-router-dom";

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
            <input
                className={styles.input}
                type={isHidden ? "password" : "text"}
                autoComplete={autoComplete ? "on" : "off"}
                onChange={(e) => onChange(e.target.value)}
            />
            {linkLabel && link &&
                <Link to={link} className={styles.link}>
                    {linkLabel}
                </Link>}
        </div>
    )
}

export default AuthPasswordField;