import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { lockProject } from '../../dashboards/winrock-dashboard/projects/winrockDashboardService';
import { nanoid } from 'nanoid';
import { unlockProject } from '../../dashboards/winrock-dashboard/projects/winrockDashboardService';

interface FormLockProps {
  projectName: string;
  onLockedAction?: () => void;
  onUnlock?: () => void;
}

// TODO need to modify to make this production ready
const UNLOCK_ENDPOINT = 'http://127.0.0.1:5001/winrock-international/us-central1/unlockFormOnClose';

const FormLock = ({ projectName, onLockedAction, onUnlock }: FormLockProps) => {
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // track whether we acquired the lock
  const acquiredLockRef = useRef(false);
  // lock owner unique id
  const lockOwnerIdRef = useRef<string>(nanoid());
  // Check project lock status and attempt to lock if not locked
  useEffect(() => {
    const checkAndLockProject = async () => {
      if (!projectName) {
        setIsLoading(false);
        return;
      }

      // (attempt to) stop duplicate lock attempts
      if (acquiredLockRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const lockResult = await lockProject(projectName, lockOwnerIdRef.current);
        console.log('Lock result:', lockResult);
        if (lockResult.success) {
          // we acquired the lock
          acquiredLockRef.current = true;
          setIsLocked(false);
          setShowLockedPopup(false);
        } else if (lockResult.errorCode === 'project-already-locked') {
          // another user has locked the form
          acquiredLockRef.current = false;
          setIsLocked(true);
          setShowLockedPopup(true);
        } else {
          console.error('Failed to lock project:', lockResult.errorCode);
        }
      } catch (error) {
        console.error('Error in project locking logic:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndLockProject();

    // unlock on page/tab close
    const handleBeforeUnload = () => {
      if (projectName && acquiredLockRef.current) {
        try {
          const payload = JSON.stringify({
            projectName,
            lockOwner: lockOwnerIdRef.current,
          });
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon(UNLOCK_ENDPOINT, blob);
        } catch {
          globalThis.alert('err');
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Cleanup function to unlock project when component unmounts (only if we acquired the lock)
    return () => {
      if (projectName && acquiredLockRef.current) {
        (async () => {
          try {
            const res = await unlockProject(projectName, lockOwnerIdRef.current);
            if (res.success && onUnlock) onUnlock();
            acquiredLockRef.current = false;
          } catch {
            // ignore
          }
        })();
      }
    }
  }, [projectName, onUnlock]);

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
    if (projectName) {
      navigate(`/dashboard/admin/projects/${projectName}`);
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
