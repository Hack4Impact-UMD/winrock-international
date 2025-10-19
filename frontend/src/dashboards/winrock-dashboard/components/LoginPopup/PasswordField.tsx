import {
    useEffect,
    useState
} from "react";
import styles from "../../../../auth/css-modules/PasswordField.module.css";
import toggleHiddenIcon from "../../../../assets/toggle-hidden.png";

interface PasswordFieldProps {
    label?: string;
    placeholder?: string;
    autoComplete?: boolean;
    toggleHidden?: boolean;
    linkLabel?: string;
    link?: string;
    controlledValue?: string;
    onChange: (value: string) => void;
    onLinkClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label = "",
    placeholder = "",
    autoComplete,
    toggleHidden=false,
    linkLabel,
    controlledValue,
    onChange,
    onLinkClick
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
                />
                {toggleHidden &&
                    <img
                        src={toggleHiddenIcon}
                        alt="Unhide"
                        className={styles.toggleHiddenIcon}
                        onClick={() => setIsHidden(!isHidden)}
                    />}
            </form>
            {linkLabel &&
                <span 
                    className={styles.link} 
                    style={{cursor: "pointer"}}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onLinkClick(e);
                    }}
                >
                    {linkLabel}
                </span>}
        </div>
    )
}

export default PasswordField;