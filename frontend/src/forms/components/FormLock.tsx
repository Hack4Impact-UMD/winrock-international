import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkProjectLock, lockProject, unlockProject } from '../../dashboards/winrock-dashboard/projects/winrockDashboardService';

interface FormLockProps {
  projectId: string;
  onLockedAction?: () => void;
  onUnlock?: () => void;
}

const FormLock = ({ projectId, onLockedAction, onUnlock }: FormLockProps) => {
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check project lock status and attempt to lock if not locked
  useEffect(() => {
    const checkAndLockProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First check if project is already locked
        const lockCheckResult = await checkProjectLock(projectId);
        
        if (!lockCheckResult.success) {
          console.error('Failed to check project lock status:', lockCheckResult.errorCode);
          setIsLoading(false);
          return;
        }

        const { isLocked: projectIsLocked } = lockCheckResult.data as { isLocked: boolean };
        
        if (projectIsLocked) {
          // Project is already locked, show popup
          setIsLocked(true);
          setShowLockedPopup(true);
          setIsLoading(false);
          return;
        }

        // Project is not locked, try to lock it
        const lockResult = await lockProject(projectId);
        
        if (!lockResult.success) {
          if (lockResult.errorCode === 'project-already-locked') {
            // Another user locked it between our check and lock attempt
            setIsLocked(true);
            setShowLockedPopup(true);
          } else {
            console.error('Failed to lock project:', lockResult.errorCode);
          }
        } else {
          // Successfully locked the project
          setIsLocked(false);
          if (onUnlock) {
            onUnlock();
          }
        }
      } catch (error) {
        console.error('Error in project locking logic:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLockProject();

    // Cleanup function to unlock project when component unmounts
    return () => {
      if (projectId && !isLocked) {
        unlockProject(projectId).catch(error => {
          console.error('Failed to unlock project on cleanup:', error);
        });
      }
    };
  }, [projectId, onUnlock]);

  // Handle locked actions (field changes, navigation, etc.)
  const handleLockedAction = () => {
    if (isLocked) {
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
    isLocked,
    isLoading,
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
