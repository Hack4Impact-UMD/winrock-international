import { useState } from 'react';
import styles from "../../css-modules/TextQuestion.module.css";

interface TextQuestionProps {
  label: string;
  isRequired?: boolean;
  isNumber?: boolean;
  onChange: (value: string) => void;
}

function TextQuestion({ label, isRequired = false, isNumber = false, onChange }: TextQuestionProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  // TODO: Add input validation

  return (
    <div className={`${styles.container} ${isRequired ? "required" : ""}`}>
      <label className={styles.title}>{label}</label>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder={"Enter text here"}
        className={styles.input}
      />
    </div>
  );
};

export default TextQuestion;