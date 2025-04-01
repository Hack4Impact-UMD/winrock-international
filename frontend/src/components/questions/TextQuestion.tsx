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

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  // TODO: Add input validation

  return (
    <div className={styles.container}>
      <label className={`${styles.label} ${required ? styles.required : ""}`}>
        {label}
      </label>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter text here"
        className={`${styles.input} ${disableOverwrite ? styles.disabled : ""}`}
      />
    </div>
  );
};

export default TextQuestion;