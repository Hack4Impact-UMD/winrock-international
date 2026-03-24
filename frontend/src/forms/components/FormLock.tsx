import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { lockForm, refreshFormLock, unlockForm } from '../../dashboards/winrock-dashboard/projects/winrockDashboardService';

const HEARTBEAT_INTERVAL_MS = 15_000;

interface FormLockProps {
  projectId: string;
  formId: string;
  userId: string;
  onLockedAction?: () => void;
  onUnlock?: () => void;
}

const FormLock = ({ projectId, formId, userId, onLockedAction, onUnlock }: FormLockProps) => {
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const didLockRef = useRef(false);
  const attemptingRef = useRef(false);

  const doUnlock = useCallback(() => {
    if (projectId && formId && didLockRef.current) {
      didLockRef.current = false;
      unlockForm(projectId, formId, userId).catch(error => {
        console.error('Failed to unlock form:', error);
      });
    }
  }, [projectId, formId, userId]);

  const attemptLock = useCallback(async () => {
    if (!projectId || !formId || !userId || attemptingRef.current) return;

    attemptingRef.current = true;
    try {
      const result = await lockForm(projectId, formId, userId);

      if (result.success) {
        didLockRef.current = true;
        setIsLocked(false);
        setShowLockedPopup(false);
        if (onUnlock) {
          onUnlock();
        }
      } else if (result.errorCode === 'form-already-locked') {
        setIsLocked(true);
        setShowLockedPopup(true);
      } else {
        console.error('Failed to lock form:', result.errorCode);
      }
    } catch (error) {
      console.error('Error in form locking logic:', error);
    } finally {
      setIsLoading(false);
      attemptingRef.current = false;
    }
  }, [projectId, formId, userId, onUnlock]);

  // Initial lock attempt on mount
  useEffect(() => {
    if (!projectId || !formId || !userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    attemptLock();

    return () => {
      doUnlock();
    };
  }, [projectId, formId, userId, attemptLock, doUnlock]);

  // refresh lockedAt every 15s so other clients know the lock is still alive
  useEffect(() => {
    if (!projectId || !formId || !userId) return;

    const interval = setInterval(() => {
      if (didLockRef.current) {
        refreshFormLock(projectId, formId, userId).catch(error => {
          console.error('Failed to refresh form lock heartbeat:', error);
        });
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [projectId, formId, userId]);

  // when the lock document changes, re-attempt if lock was released or went stale
  useEffect(() => {
    if (!projectId || !formId) return;

    const lockDocRef = doc(db, 'form-locks', `${projectId}_${formId}`);

    const unsubscribe = onSnapshot(lockDocRef, (snapshot) => {
      const data = snapshot.data();

      // if the lock was released and we don't hold it, try to acquire it
      if ((!data || !data.isLocked) && !didLockRef.current) {
        attemptLock();
      }
    });

    return () => unsubscribe();
  }, [projectId, formId, attemptLock]);

  // safety - unlock on tab/browser close (best-effort)
  useEffect(() => {
    const handleBeforeUnload = () => {
      doUnlock();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [doUnlock]);

  const handleLockedAction = () => {
    if (isLocked) {
      setShowLockedPopup(true);
      if (onLockedAction) {
        onLockedAction();
      }
    }
  };

  const closePopup = () => {
    setShowLockedPopup(false);
  };

  const handleBackToProject = () => {
    window.close();
  };

  return {
    showLockedPopup,
    handleLockedAction,
    closePopup,
    isLocked,
    isLoading,
    doUnlock,
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
