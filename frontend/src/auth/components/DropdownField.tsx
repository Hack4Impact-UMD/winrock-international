import {
    useEffect,
    useState
} from "react";
import styles from "../css-modules/DropdownField.module.css";

interface DropdownFieldProps {
    label: string;
    blankOption?: string;
    options: string[];
    values: string[];
    controlledValue?: string;
    onSelect: (selected: string) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    blankOption,
    options,
    values,
    controlledValue,
    onSelect
}: DropdownFieldProps) => {
    const [value, setValue] = useState(controlledValue);
        
    useEffect(() => {
        setValue(controlledValue);
    }, [controlledValue]);

    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setValue(e.target.value);
        onSelect(e.target.value);
    }

    return (
        <div className={styles.selectWrapper}>
            <p className={styles.label}>
                {label}
            </p>
            <select
                className={styles.select}
                onChange={(e) => handleSelect(e)}
            >
                {blankOption &&
                    <option value="" selected={value === ""}>{blankOption}</option>}
                {options.map((option, i) =>
                    <option value={values[i]} key={values[i]} selected={value === values[i]}>{option}</option>)}
            </select>
            <svg className={styles.selectIcon} width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.75L6.5 6.25L12 0.75" stroke="black" strokeWidth="2" />
            </svg>
        </div>
    )
}

export default DropdownField;