import React, { useState } from "react";
import styles from "../css-modules/TextQuestion.module.css"

interface TextQuestionProps {
  name: string;
  response: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ name, response }) => {
  const [userResponse, setUserResponse] = useState<string>(response);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(event.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{name}</label>
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