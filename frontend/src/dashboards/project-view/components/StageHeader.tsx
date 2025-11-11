import React from 'react';
import { stageMap } from '../ProjectViewUtils';

interface StageHeaderProps {
  analysisStage: string;
}

const StageHeader: React.FC<StageHeaderProps> = ({ analysisStage }) => {
  const stageNumber = stageMap[analysisStage] || 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "#1a4b8b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "600"
      }}>
        {stageNumber}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1a4b8b", margin: 0 }}>
        {analysisStage}
      </h3>
    </div>
  );
};

export default StageHeader;

