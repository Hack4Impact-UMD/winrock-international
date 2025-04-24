import React from 'react';
import styles from '../css-modules/TableRow.module.css';
import ColorText from '../components/ColorText';
import RowCustomSelect from '../components/RowCustomSelect';

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
    supplierName: string;
    overallStatus: StatusType;
    analysisStage: AnalysisStageType;
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
  };
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  isEditMode?: boolean;
  onFieldChange?: (field: keyof TableRowProps['data'], value: string) => void;
}

const statusOptions: StatusType[] = [
  'On Track',
  'At Risk',
  'Paused',
  'Completed',
  'Completed (except for risk)'
];

const analysisStageOptions: AnalysisStageType[] = [
  'Risk & Co-benefit Assessment',
  'GHG Assessment Analysis',
  'Confirming Final Requirements',
  'Clarifying Initial Project Information',
  'Complete, and Excluded'
];

const TableRow: React.FC<TableRowProps> = ({
  data,
  isSelected = false,
  onSelect,
  isEditMode = false,
  onFieldChange
}) => {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.checkboxCell}>
        <div className={`${styles.checkboxWrapper} ${!isEditMode ? styles.hidden : ''}`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className={styles.checkbox}
            disabled={!isEditMode}
          />
        </div>
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <span>{data.project}</span> // Not editable in edit mode
        ) : (
          data.project
        )}
      </td>

      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.supplierName}
            onChange={(e) => onFieldChange?.('supplierName', e.target.value)}
            className={styles.editableInput}
          />
        ) : data.supplierName}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <RowCustomSelect
            value={data.overallStatus}
            options={statusOptions}
            onChange={(value) => onFieldChange?.('overallStatus', value)}
            variant="status"
          />
        ) : (
          <ColorText
            text={data.overallStatus}
            category={data.overallStatus}
            variant="status"
          />
        )}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <RowCustomSelect
            value={data.analysisStage}
            options={analysisStageOptions}
            onChange={(value) => onFieldChange?.('analysisStage', value)}
            variant="analysis"
          />
        ) : (
          <ColorText
            text={data.analysisStage}
            category={data.analysisStage}
            variant="analysis"
          />
        )}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.spendCategory}
            onChange={(e) => onFieldChange?.('spendCategory', e.target.value)}
            className={styles.editableInput}
          />
        ) : data.spendCategory}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.geography}
            onChange={(e) => onFieldChange?.('geography', e.target.value)}
            className={styles.editableInput}
          />
        ) : data.geography}
      </td>
      <td className={styles.cell}>{data.lastUpdated}</td>
      <td className={styles.cell}>{data.startDate}</td>
      <td className={styles.actionCell}>
        <button className={styles.actionButton}>•••</button>
      </td>
    </tr>
  );
};

export default TableRow; 