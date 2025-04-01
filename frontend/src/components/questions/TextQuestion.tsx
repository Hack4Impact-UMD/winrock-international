import { useEffect, useState } from 'react';
import styles from "../../css-modules/TextQuestion.module.css";

interface TextQuestionProps {
  label: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
  disableOverwrite?: boolean;
}

function TextQuestion({ label, onChange, defaultValue="", required = false, disableOverwrite = false }: TextQuestionProps) {
  const [value, setValue] = useState(defaultValue);
  const [placeholder, setPlaceholder] = useState("Enter text here");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    setIsValid(true);
    setPlaceholder("Enter text here");

    onChange(newValue);
  };

  function validate() {
    if (required && value === defaultValue) {
      setIsValid(false);
      setPlaceholder("This field is required");
    }
  }

  return (
    <div className={styles.container}>
      <label className={`${styles.label} ${required ? styles.requiredLabel : ""}`}>
        {label}
      </label>

      <textarea
        className={`${styles.input} ${isValid ? styles.validInput : styles.invalidInput} ${disableOverwrite ? styles.disabledInput : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={validate}
      />
    </div>
  );
};

export default TextQuestion;