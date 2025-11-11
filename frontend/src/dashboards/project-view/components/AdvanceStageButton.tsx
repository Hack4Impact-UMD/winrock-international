import React from 'react';
import styles from '../css-modules/ProjectView.module.css';
import { finalStage } from '../ProjectViewUtils';

interface AdvanceStageButtonProps {
  currentStage: string;
  onClick: () => void;
}

const AdvanceStageButton: React.FC<AdvanceStageButtonProps> = ({ currentStage, onClick }) => {
  const isDisabled = currentStage === finalStage;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <button 
        style={{
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#ffffff",
          backgroundColor: "#1a4b8b",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={onClick}
        disabled={isDisabled}
        className={styles.markedStageButton}
      >
        Mark Stage as Complete
      </button>
    </div>
  );
};

export default AdvanceStageButton;

