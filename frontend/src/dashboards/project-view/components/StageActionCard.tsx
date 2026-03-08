import React from 'react';

interface StageActionCardProps {
  analysisStage: string;
  proposalFormID: string;
  riskFormID: string;
  onUploadClick?: () => void;
}

const StageActionCard: React.FC<StageActionCardProps> = ({
  analysisStage,
  proposalFormID,
  riskFormID,
  onUploadClick
}) => {
  const onClick = () => {
    if (analysisStage === "Clarifying Initial Project Information") {
      window.open(
        `/winrock-international/view-form/proposal/${proposalFormID}`,
        "_blank"
      );
      return;
    }

    if (analysisStage === "Risk & Co-benefit Assessment") {
      window.open(
        `/winrock-international/view-form/risk/${riskFormID}`,
        "_blank"
      );
      return;
    }

    if (analysisStage === "GHG Assessment Analysis") {
      if (onUploadClick) onUploadClick();
      return;
    }
  };

  // Determine the title and button text based on stage
  let title: string;
  let buttonText: string;
  if (analysisStage === 'Clarifying Initial Project Information') {
    title = "Edit Project Proposal Form";
    buttonText = "View and Edit";
  } else if (analysisStage === 'GHG Assessment Analysis') {
    title = "Upload GHG Assessment";
    buttonText = "Upload";
  } else if (analysisStage === 'Risk & Co-benefit Assessment') {
    title = "Risks & Co-Benefit form";
    buttonText = "View and Edit";
  } else {
    // Default case (shouldn't show for other stages, but handle gracefully)
    return null;
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      marginTop: "20px",
      marginBottom: "20px",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <span style={{ fontSize: "16px", fontWeight: "500", color: "#1a4b8b" }}>{title}</span>
      <button onClick={onClick}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#1a4b8b",
          backgroundColor: "transparent",
          border: "1px solid #1a4b8b",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
        {buttonText}
      </button>
    </div>
  );
};

export default StageActionCard;

