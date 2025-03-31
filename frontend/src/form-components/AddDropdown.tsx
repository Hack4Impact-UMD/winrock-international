import React, { useState } from 'react';

interface AddDropdownProps {
  questionID: string;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  onSelect?: (questionID: string, value: string) => void;
  additionalText?: string;
  followUpPlaceholder?: string;
}

const AddDropdown: React.FC<AddDropdownProps> = ({
  questionID,
  questionTitle,
  option1,
  option2,
  option3,
  onSelect,
  additionalText = 'Please justify your answer, including if a mitigation plan is in place.',
  followUpPlaceholder = 'Type here'
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpText, setFollowUpText] = useState('');

  const styles = {
    addDropdownContainer: {
      padding: '15px 20px',
      borderBottom: '1px solid #eee',
      backgroundColor: 'white',
    },
    questionContainer: {
      marginBottom: '10px',
    },
    questionText: {
      margin: '0 0 10px 0',
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.4,
    },
    selectWrapper: {
      position: 'relative' as 'relative',
    },
    selectElement: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'white',
      appearance: 'none' as 'none',
    },
    selectArrow: {
      position: 'absolute' as 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #333',
      pointerEvents: 'none' as 'none',
    },
    followUpContainer: {
      marginTop: '10px',
    },
    followUpText: {
      margin: '0 0 8px 0',
      fontSize: '13px',
      color: '#666',
    },
    followUpTextarea: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      resize: 'vertical' as 'vertical',
    }
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    setShowFollowUp(value !== '');
    
    if (onSelect) {
      onSelect(questionID, value);
    }
  };

  const handleFollowUpChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFollowUpText(event.target.value);
  };

  return (
    <div style={styles.addDropdownContainer}>
      <div style={styles.questionContainer}>
        <p style={styles.questionText}>{questionTitle}</p>
        <div style={styles.selectWrapper}>
          <select
            id={questionID}
            value={selectedOption}
            onChange={handleDropdownChange}
            style={styles.selectElement}
          >
            <option value="" disabled>Select an option</option>
            {option1 && <option value={option1}>{option1}</option>}
            {option2 && <option value={option2}>{option2}</option>}
            {option3 && <option value={option3}>{option3}</option>}
          </select>
          <div style={styles.selectArrow}></div>
        </div>
      </div>

      {showFollowUp && (
        <div style={styles.followUpContainer}>
          <p style={styles.followUpText}>{additionalText}</p>
          <textarea
            id={`${questionID}-followup`}
            value={followUpText}
            onChange={handleFollowUpChange}
            style={styles.followUpTextarea}
            placeholder={followUpPlaceholder}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default AddDropdown;