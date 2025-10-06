import {
    useEffect,
    useState
} from "react";
import styles from "../css-modules/PasswordField.module.css";
import { Link } from "react-router-dom";
import toggleHiddenIcon from "../../assets/toggle-hidden.png";

interface PasswordFieldProps {
    label?: string;
    placeholder?: string;
    autoComplete?: boolean;
    toggleHidden?: boolean;
    linkLabel?: string;
    link?: string;
    controlledValue?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label = "",
    placeholder = "",
    autoComplete,
    toggleHidden=false,
    linkLabel,
    link,
    controlledValue,
    onChange,
    onKeyDown
}) => {
    const [value, setValue] = useState(controlledValue);
        
    useEffect(() => {
        setValue(controlledValue);
    }, [controlledValue]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        onChange(e.target.value);
    }
    
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
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autoComplete ? "on" : "off"}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={onKeyDown}
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

export default PasswordField;