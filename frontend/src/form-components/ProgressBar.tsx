import React from 'react';

interface ProgressBarProps {
  steps: number;
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  const styles = {
    progressContainer: {
      padding: '20px 30px',
      backgroundColor: 'white',
    },
    progressBar: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      position: 'relative' as 'relative',
    },
    progressStep: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      position: 'relative' as 'relative',
    },
    stepCircle: (isActive: boolean, isCurrent: boolean) => ({
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: isActive ? '#4CAF50' : '#ddd',
      border: isCurrent ? '3px solid #4CAF50' : 'none',
      zIndex: 2,
    }),
    stepLine: (isActive: boolean) => ({
      height: '2px',
      backgroundColor: isActive ? '#4CAF50' : '#ddd',
      width: '100%',
      position: 'relative' as 'relative',
    }),
  };

  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        {Array.from({ length: steps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={stepNumber} 
              style={styles.progressStep}
            >
              <div style={styles.stepCircle(isActive, isCurrent)}></div>
              {index < steps - 1 && (
                <div style={styles.stepLine(isActive && stepNumber < currentStep)}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;