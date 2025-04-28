import React, { useState, useEffect } from 'react';
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
  onSave?: (updatedFields: Partial<TableRowProps['data']>) => void; // ✅ only one call
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
  onSave,
}) => {
  // --- Local State for Editable Fields ---
  const [localSupplierName, setLocalSupplierName] = useState(data.supplierName);
  const [localOverallStatus, setLocalOverallStatus] = useState<StatusType>(data.overallStatus);
  const [localAnalysisStage, setLocalAnalysisStage] = useState<AnalysisStageType>(data.analysisStage);
  const [localSpendCategory, setLocalSpendCategory] = useState(data.spendCategory);
  const [localGeography, setLocalGeography] = useState(data.geography);

  // Refresh local states when `data` changes
  useEffect(() => {
    setLocalSupplierName(data.supplierName);
    setLocalOverallStatus(data.overallStatus);
    setLocalAnalysisStage(data.analysisStage);
    setLocalSpendCategory(data.spendCategory);
    setLocalGeography(data.geography);
  }, [data]);

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

      {/* Project Name - Not Editable */}
      <td className={styles.cell}>{data.project}</td>

      {/* Supplier Name */}
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={localSupplierName}
            onChange={(e) => setLocalSupplierName(e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.supplierName
        )}
      </td>

      {/* Overall Status */}
      <td className={styles.cell}>
        {isEditMode ? (
          <RowCustomSelect
            value={localOverallStatus}
            options={statusOptions}
            onChange={(value) => setLocalOverallStatus(value as StatusType)}
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

      {/* Analysis Stage */}
      <td className={styles.cell}>
        {isEditMode ? (
          <RowCustomSelect
            value={localAnalysisStage}
            options={analysisStageOptions}
            onChange={(value) => setLocalAnalysisStage(value as AnalysisStageType)}
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

      {/* Spend Category */}
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={localSpendCategory}
            onChange={(e) => setLocalSpendCategory(e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.spendCategory
        )}
      </td>

      {/* Geography */}
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={localGeography}
            onChange={(e) => setLocalGeography(e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.geography
        )}
      </td>

      {/* Last Updated - Not Editable */}
      <td className={styles.cell}>{data.lastUpdated}</td>

      {/* Start Date - Not Editable */}
      <td className={styles.cell}>{data.startDate}</td>

      {/* Actions */}
      <td className={styles.actionCell}>
        {isEditMode ? (
          <button
            className={styles.saveButton}
            onClick={() => {
              onSave?.({
                supplierName: localSupplierName,
                overallStatus: localOverallStatus,
                analysisStage: localAnalysisStage,
                spendCategory: localSpendCategory,
                geography: localGeography,
              });
            }}
          >
            Save
          </button>
        ) : (
          <button className={styles.actionButton}>•••</button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
