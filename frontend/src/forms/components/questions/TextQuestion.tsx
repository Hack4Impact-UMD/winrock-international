import React, { useState } from "react";
import styles from "../../css-modules/TextQuestion.module.css";

interface TextQuestionProps {
  name: string;
  response: string;
  className?: string; // Add className as an optional prop
}

const TextQuestion: React.FC<TextQuestionProps> = ({ name, response, className }) => {
  const [userResponse, setUserResponse] = useState<string>(response);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(event.target.value);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <label className={styles.label}>
        {name.split(/(\(\S+\))/).map((part, index) => 
          // Apply the red color to units within parentheses
          part.match(/\(\S+\)/) ? <span key={index} className={styles.redText}>{part}</span> : part
        )}
      </label>
      <textarea
        value={userResponse}
        onChange={handleInputChange}
        className={styles.textarea}
        placeholder="Enter text here"
      />
    </div>
  );
};

export default TextQuestion;