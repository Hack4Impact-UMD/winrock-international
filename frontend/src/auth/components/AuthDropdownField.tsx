import styles from "../css-modules/AuthDropdownField.module.css";

interface AuthDropdownFieldProps {
    label: string;
    blankOption?: string;
    options: string[];
    values: string[];
    onSelect: (selected: string) => void;
}

function AuthDropdownField({ label, blankOption, options, values, onSelect }: AuthDropdownFieldProps) {
    return (
        <div className={styles.selectWrapper}>
            <p className={styles.label}>
                {label}
            </p>
            <select
                className={styles.select}
                onChange={(e) => onSelect(e.target.value) }
            >
                {blankOption &&
                    <option value="">{blankOption}</option>}
                {options.map((option, i) =>
                    <option value={values[i]} key={values[i]}>{option}</option>)}
            </select>
            <svg className={styles.selectIcon} width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.75L6.5 6.25L12 0.75" stroke="black" strokeWidth="2" />
            </svg>
        </div>
    )
}

export default AuthDropdownField;