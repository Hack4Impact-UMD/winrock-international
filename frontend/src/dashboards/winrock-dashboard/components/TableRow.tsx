import React from 'react';
import styles from '../css-modules/TableRow.module.css';
import ColorText from '../components/ColorText';

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
  | 'Clarifying Initial Project Information'
  | 'Complete, and Excluded';

interface TableRowProps {
  data: {
    id: number;
    project: string;
    supplier: string;
    overallStatus: StatusType;
    analysisStage: AnalysisStageType;
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
  };
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({ data, isSelected = false, onSelect }) => {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.checkboxCell}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
      </td>
      <td className={styles.cell}>{data.project}</td>
      <td className={styles.cell}>{data.supplier}</td>
      <td className={styles.cell}>
        <ColorText
          text={data.overallStatus}
          category={data.overallStatus}
          variant="status"
        />
      </td>
      <td className={styles.cell}>
        <ColorText
          text={data.analysisStage}
          category={data.analysisStage}
          variant="analysis"
        />
      </td>
      <td className={styles.cell}>{data.spendCategory}</td>
      <td className={styles.cell}>{data.geography}</td>
      <td className={styles.cell}>{data.lastUpdated}</td>
      <td className={styles.cell}>{data.startDate}</td>
      <td className={styles.actionCell}>
        <button className={styles.actionButton}>•••</button>
      </td>
    </tr>
  );
};

export default TableRow; 