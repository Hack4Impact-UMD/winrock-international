import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormLockProps {
  locked: boolean;
  projectId?: string;
  onLockedAction?: () => void;
}

const FormLock = ({ locked, projectId, onLockedAction }: FormLockProps) => {
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const navigate = useNavigate();

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

  // Handle back to project navigation
  const handleBackToProject = () => {
    if (projectId) {
      navigate(`/dashboard/admin/projects/${projectId}`);
    } else {
      // Fallback if no projectId is provided
      navigate('/dashboard/admin/projects');
    }
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
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}>
          {/* Close button */}
          <button
            onClick={closePopup}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
          
          <h2 style={{
            color: '#000',
            marginBottom: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            marginTop: '0'
          }}>
            This form is locked for editing.
          </h2>
          <p style={{
            color: '#000',
            marginBottom: '20px',
            fontSize: '16px',
            lineHeight: '1.5',
            marginTop: '0'
          }}>
            Another user is currently making changes. Please check back later.
          </p>
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={handleBackToProject}
              style={{
                backgroundColor: '#005293',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Back to Project
            </button>
          </div>
        </div>
      </div>
    ) : null
  };
};

export default FormLock;
