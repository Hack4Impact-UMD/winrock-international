import { useEffect, useState } from "react";
import styles from "../css-modules/AuthTextField.module.css";

interface AuthTextFieldProps {
    label?: string;
    placeholder?: string;
    autoComplete?: boolean;
    controlledValue?: string;
    onChange: (value: string) => void;
}

function AuthTextField({ label="", placeholder="", autoComplete = true, controlledValue, onChange }: AuthTextFieldProps) {
    const [value, setValue] = useState(controlledValue);
    
    useEffect(() => {
        setValue(controlledValue);
    }, [controlledValue]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        onChange(e.target.value);
    }

    return (
        <div className={styles.fieldContainer}>
            <p className={styles.label}>
                {label}
            </p>
            <input
                className={styles.input}
                type="text"
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete ? "on" : "off"}
                onChange={(e) => handleChange(e)}
            />
        </div>
    )
}

export default AuthTextField;