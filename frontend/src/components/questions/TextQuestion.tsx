import { useEffect, useState } from 'react';
import styles from "../../css-modules/TextQuestion.module.css";

interface TextQuestionProps {
  label: string;
  onChange: (value: string) => void;
  controlledValue: string;
  required?: boolean;
  disableOverwrite?: boolean;
  size?: 'small' | 'large';
  removeTopPadding?: boolean;
}

function TextQuestion({ 
  label, 
  onChange, 
  controlledValue, 
  required = false, 
  disableOverwrite = false,
  size = 'large',
  removeTopPadding = false
}: TextQuestionProps) {
  const [value, setValue] = useState(controlledValue);
  const [placeholder, setPlaceholder] = useState("Enter text here");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(controlledValue)
  }, [controlledValue]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    setIsValid(true);
    setPlaceholder("Enter text here");

    onChange(newValue);
  };

  function validate() {
    if (required && value === '') {
      setIsValid(false);
      setPlaceholder("This field is required");
    }
  }

  return (
    <div className={`${styles.container} ${size === 'small' ? styles.smallContainer : ''} ${removeTopPadding ? styles.noTopPadding : ''}`}>
      <label className={`${styles.label} ${required ? styles.requiredLabel : ""} ${size === 'small' ? styles.smallLabel : ''}`}>
        {label}
      </label>

      <textarea
        className={`${styles.input} ${isValid ? styles.validInput : styles.invalidInput} ${disableOverwrite ? styles.disabledInput : ""} ${size === 'small' ? styles.smallInput : ''}`}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={validate}
      />
    </div>
  );
};

export default TextQuestion;