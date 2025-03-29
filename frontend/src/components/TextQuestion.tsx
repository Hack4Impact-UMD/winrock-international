import React, { useState, CSSProperties } from "react";

interface TextQuestionProps {
  name: string;
  id: string;
  response: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ name, id, response }) => {
  const [userResponse, setUserResponse] = useState<string>(response);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(event.target.value);
  };

  return (
    <div style={styles.container}>
      <label htmlFor={id} style={styles.label}>{name}</label>
      <textarea
        id={id}
        value={userResponse}
        onChange={handleInputChange}
        style={styles.textarea}
      />
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    width: "100%",
  },
  label: {
    fontSize: "1rem",
    color: "#333",
  },
  textarea: {
    width: "100%",
    minHeight: "4rem",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "0.25rem",
    border: "1px solid #ccc",
    resize: "vertical",
    fontFamily: "inherit",
  },
};

export default TextQuestion;
