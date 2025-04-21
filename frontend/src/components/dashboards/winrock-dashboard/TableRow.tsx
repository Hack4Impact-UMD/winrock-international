import React from 'react';
import styles from '../../../css-modules/TableRow.module.css';
import ColorText from './ColorText';
import RowCustomSelect from './RowCustomSelect';

interface TableRowProps {
  data: {
    id: number;
    project: string;
    supplier: string;
    overallStatus: 'On Track' | 'At Risk' | 'Paused' | 'Completed' | 'Completed (except for risk)';
    analysisStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded';
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
    activityType: string;
  };
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  isEditMode: boolean;
  onFieldChange: (field: string, value: string) => void;
}

const STATUS_OPTIONS: TableRowProps['data']['overallStatus'][] = [
  'On Track',
  'At Risk',
  'Paused',
  'Completed',
  'Completed (except for risk)'
];

const ANALYSIS_OPTIONS: TableRowProps['data']['analysisStage'][] = [
  'Risk & Co-benefit Assessment',
  'GHG Assessment Analysis',
  'Confirming Final Requirements',
  'Clarifying Initial Project Information',
  'Complete, and Excluded'
];

const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  isSelected, 
  onSelect,
  isEditMode,
  onFieldChange
}) => {
  const handleInputChange = (field: string, value: string) => {
    onFieldChange(field, value);
  };

  return (
    <tr className={styles.tableRow}>
      <td className={styles.checkboxCell}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.project
        )}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.supplier
        )}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <RowCustomSelect
            value={data.overallStatus}
            options={STATUS_OPTIONS}
            onChange={(value) => handleInputChange('overallStatus', value)}
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
            options={ANALYSIS_OPTIONS}
            onChange={(value) => handleInputChange('analysisStage', value)}
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
      <td className={styles.cell}>{data.spendCategory}</td>
      <td className={styles.cell}>{data.geography}</td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.lastUpdated}
            onChange={(e) => handleInputChange('lastUpdated', e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.lastUpdated
        )}
      </td>
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={data.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.startDate
        )}
      </td>
      <td className={styles.actionCell}>
        <button className={styles.actionButton}>•••</button>
      </td>
    </tr>
  );
};

export default TableRow; 