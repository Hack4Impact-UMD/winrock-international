import styles from "../css-modules/AuthTextField.module.css";

interface AuthTextFieldProps {
    label?: string;
    placeholder?: string;
    autoComplete?: boolean;
    onChange: (value: string) => void;
}

function AuthTextField({ label="", placeholder="", autoComplete = true, onChange }: AuthTextFieldProps) {
    return (
        <div className={styles.fieldContainer}>
            <p className={styles.label}>
                {label}
            </p>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                autoComplete={autoComplete ? "on" : "off"}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default AuthTextField;