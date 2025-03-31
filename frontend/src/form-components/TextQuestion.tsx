import React, { useState } from 'react';

interface TextQuestionProps {
  name: string;
  questionID: string;
  response?: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
  name,
  questionID,
  response = ''
}) => {
  const [userResponse, setUserResponse] = useState<string>(response);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(event.target.value);
  };

  const styles = {
    textQuestionContainer: {
      padding: '15px 20px',
      backgroundColor: 'white',
    },
    questionText: {
      margin: '0 0 10px 0',
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.4,
    },
    textQuestionTextarea: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      resize: 'vertical' as 'vertical',
      minHeight: '100px',
    }
  };

  return (
    <div style={styles.textQuestionContainer}>
      <label htmlFor={questionID} style={styles.questionText}>{name}</label>
      <textarea
        id={questionID}
        value={userResponse}
        onChange={handleInputChange}
        style={styles.textQuestionTextarea}
        rows={5}
      />
    </div>
  );
};

export default TextQuestion;