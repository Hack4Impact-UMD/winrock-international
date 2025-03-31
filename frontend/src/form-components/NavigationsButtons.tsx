import React from 'react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onSave?: () => void;
  onSaveAndExit?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showSave?: boolean;
  showSaveAndExit?: boolean;
  showNext?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onSave,
  onSaveAndExit,
  onNext,
  showBack = true,
  showSave = true,
  showSaveAndExit = true,
  showNext = true
}) => {
  const styles = {
    navigationButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: 'white',
      borderTop: '1px solid #eee',
    },
    rightButtons: {
      display: 'flex',
      gap: '10px',
    },
    navButton: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 500,
      border: '1px solid #ddd',
      transition: 'background-color 0.2s, border-color 0.2s',
    },
    backButton: {
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
    saveButton: {
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
    saveExitButton: {
      backgroundColor: 'white',
      color: '#1e5180',
      borderColor: '#1e5180',
    },
    nextButton: {
      backgroundColor: '#1e5180',
      color: 'white',
      borderColor: '#1e5180',
    }
  };

  return (
    <div style={styles.navigationButtons}>
      {showBack && (
        <button 
          type="button" 
          style={{...styles.navButton, ...styles.backButton}}
          onClick={onBack}
        >
          Back
        </button>
      )}

      <div style={styles.rightButtons}>
        {showSave && (
          <button 
            type="button" 
            style={{...styles.navButton, ...styles.saveButton}}
            onClick={onSave}
          >
            Save Changes
          </button>
        )}

        {showSaveAndExit && (
          <button 
            type="button" 
            style={{...styles.navButton, ...styles.saveExitButton}}
            onClick={onSaveAndExit}
          >
            Save and Exit
          </button>
        )}

        {showNext && (
          <button 
            type="button" 
            style={{...styles.navButton, ...styles.nextButton}}
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;