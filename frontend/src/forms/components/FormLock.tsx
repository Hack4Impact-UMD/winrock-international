import { useState, useEffect } from 'react';

interface FormLockProps {
  locked: boolean;
  onLockedAction?: () => void;
}

const FormLock = ({ locked, onLockedAction }: FormLockProps) => {
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  // Show popup immediately when form loads if locked
  useEffect(() => {
    if (locked) {
      setShowLockedPopup(true);
    }
  }, [locked]);

  // Handle locked actions (field changes, navigation, etc.)
  const handleLockedAction = () => {
    if (locked) {
      setShowLockedPopup(true);
      if (onLockedAction) {
        onLockedAction();
      }
    }
  };

  // Close popup
  const closePopup = () => {
    setShowLockedPopup(false);
  };

  return {
    showLockedPopup,
    handleLockedAction,
    closePopup,
    LockedPopup: showLockedPopup ? (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            color: '#d32f2f',
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Form Locked
          </h2>
          <p style={{
            color: '#333',
            marginBottom: '30px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            This form is currently locked and cannot be edited. Please contact your administrator if you need to make changes.
          </p>
          <button
            onClick={closePopup}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            OK
          </button>
        </div>
      </div>
    ) : null
  };
};

export default FormLock;
