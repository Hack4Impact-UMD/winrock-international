import {
    useEffect,
    useState
} from "react";
import styles from "../css-modules/TextField.module.css";

interface TextFieldProps {
    label?: string;
    placeholder?: string;
    autoComplete?: boolean;
    controlledValue?: string;
    onChange: (value: string) => void;
    suggestions?: string[];
    onSuggestionClick?: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({
    label = "",
    placeholder = "",
    autoComplete = true,
    controlledValue,
    onChange,
    suggestions = [],
    onSuggestionClick = () => { },
    onKeyDown
}) => {
    const [value, setValue] = useState(controlledValue);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setValue(controlledValue);
    }, [controlledValue]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const input = e.target.value;
        setValue(input);
        onChange(input);
        setShowSuggestions(true);
    }

    function handleSuggestionClick(suggestion: string) {
        setValue(suggestion);
        onChange(suggestion);
        onSuggestionClick(suggestion);
        setShowSuggestions(false);
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
                onChange={handleChange}
                onKeyDown={onKeyDown}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionsList}>
                    {suggestions.slice(0, 5).map((s, i) => (
                        <li
                            key={i}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(s)}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TextField;
