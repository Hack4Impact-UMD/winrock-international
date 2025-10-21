import React from 'react';
import styles from '../css-modules/ColorText.module.css';

// Define the possible status and analysis stage types
type StatusType =
  | 'On Track'
  | 'At Risk'
  | 'Paused'
  | 'Completed'
  | 'Completed (except for risk)';

type AnalysisStageType =
  | 'Risk & Co-benefit Assessment'
  | 'GHG Assessment Analysis'
  | 'Confirming Final Requirements'
  | 'Clarifying Technical Details'
  | 'Clarifying Initial Project Information'
  | 'Complete, and Excluded';

interface ColorTextProps {
  text: string;
  category: StatusType | AnalysisStageType;
  variant: 'status' | 'analysis';
}

const STATUS_COLORS: Record<StatusType, { bg: string; text: string }> = {
  'On Track': { bg: '#E1EEFC', text: '#072F63' },
  'At Risk': { bg: '#FAF0F3', text: '#D12953' },
  'Paused': { bg: '#FCF4E1', text: '#633B07' },
  'Completed': { bg: '#E1FCEF', text: '#076337' },
  'Completed (except for risk)': { bg: '#EDFCE1', text: '#376307' }
};

const ANALYSIS_COLORS: Record<AnalysisStageType, { bg: string; text: string }> = {
  'Risk & Co-benefit Assessment': { bg: '#F1DFFE', text: '#7A0F82' },
  'GHG Assessment Analysis': { bg: '#FEDFF5', text: '#820F65' },
  'Confirming Final Requirements': { bg: '#DFE9FE', text: '#294B91' },
  'Clarifying Initial Project Information': { bg: '#DFF8FE', text: '#0F7282' },
  'Complete, and Excluded': { bg: '#DFFEE5', text: '#12820F' },
  'Clarifying Technical Details': {bg: '#FBFFC7', text: '#595c2b'}
};

const ColorText: React.FC<ColorTextProps> = ({
  text,
  category,
  variant
}) => {
  const colors = variant === 'status'
    ? STATUS_COLORS[category as StatusType]
    : ANALYSIS_COLORS[category as AnalysisStageType];

  if (!colors) {
    console.warn(`Unknown category "${category}" passed to ColorText`);
    return <span className={styles.colorText}>{text}</span>;
  }
  const customStyle = {
    backgroundColor: colors.bg,
    color: colors.text
  };

  // Handle multi-line text for "Completed (except for risk)"
  const formattedText = text === 'Completed (except for risk)'
    ? <>Completed<br />(except for risk)</>
    : text;

  return (
    <span className={styles.colorText} style={customStyle}>
      {formattedText}
    </span>
  );
};

export default ColorText;
