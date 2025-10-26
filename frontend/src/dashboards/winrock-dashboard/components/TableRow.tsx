import React, { useState, useEffect } from 'react';
import styles from '../css-modules/TableRow.module.css';
import ColorText from '../components/ColorText';
import RowCustomSelect from '../components/RowCustomSelect';
import PopupMenu from './PopupMenu'; // ⬅️ Import the portal popup component (you need to create it too if you haven't yet)
import { useNavigate } from 'react-router-dom';

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
  | 'Clarifying Technical Details'  // ← Add this line
  | 'Clarifying Initial Project Information'
  | 'Complete, and Excluded';


interface TableRowProps {
  data: {
    id: string;
    projectName: string;
    clientName: string;
    supplierName: string;
    overallStatus: StatusType;
    analysisStage: AnalysisStageType;
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
    isActive: boolean;
  };
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  isEditMode?: boolean;
  onSave?: (updatedFields: Partial<TableRowProps['data']>) => void;
  onActionClick?: (id: string | null, event?: React.MouseEvent) => void; // 👈 updated here
  onArchiveClick?: (id: string) => void;
  activeActionMenuId?: string | null;
  onRowClick?: () => void;
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
  'Clarifying Technical Details',  // ← Add this line
  'Clarifying Initial Project Information',
  'Complete, and Excluded'
];

const TableRow: React.FC<TableRowProps> = ({
  data,
  isSelected = false,
  onSelect,
  isEditMode = false,
  onSave,
  onActionClick,         // ✅ ADD THIS
  onArchiveClick,        // ✅ ADD THIS
  activeActionMenuId,    // ✅ ADD THIS
  onRowClick,
}) => {
  // --- Local State for Editable Fields ---
  const [localClientName, setLocalClientName] = useState(data.clientName);
  const [localProjectName, setLocalProjectName] = useState(data.projectName);
  const [localSupplierName, setLocalSupplierName] = useState(data.supplierName);
  const [localOverallStatus, setLocalOverallStatus] = useState<StatusType>(data.overallStatus);
  const [localAnalysisStage, setLocalAnalysisStage] = useState<AnalysisStageType>(data.analysisStage);
  const [localSpendCategory, setLocalSpendCategory] = useState(data.spendCategory);
  const [localGeography, setLocalGeography] = useState(data.geography);
  const [buttonPosition, setButtonPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Refresh local states when `data` changes
  useEffect(() => {
    setLocalClientName(data.clientName);
    setLocalProjectName(data.projectName);
    setLocalSupplierName(data.supplierName);
    setLocalOverallStatus(data.overallStatus);
    setLocalAnalysisStage(data.analysisStage);
    setLocalSpendCategory(data.spendCategory);
    setLocalGeography(data.geography);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.actionMenuWrapper}`)) {
        onActionClick?.(null); // close menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      {/* Project Name - NOW EDITABLE */}
      <td className={`${styles.cell} ${!isEditMode ? styles.projectLink : ''}`}
        onClick={() => {
          if (!isEditMode) {
            navigate(`/projects/${data.projectName}`);
            onRowClick?.();
          }
        }}
        style={!isEditMode ? { cursor: 'pointer', textDecoration: 'underline' } : {}}
      >
        {isEditMode ? (
          <input
            type="text"
            value={localProjectName}
            onChange={(e) => setLocalProjectName(e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.projectName
        )}
      </td>

      {/* Client Name */}
      <td className={styles.cell}>
        {isEditMode ? (
          <input
            type="text"
            value={localClientName}
            onChange={(e) => setLocalClientName(e.target.value)}
            className={styles.editableInput}
          />
        ) : (
          data.clientName
        )}
      </td>

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
                projectName: localProjectName,
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
          <div className={styles.actionMenuWrapper}>
            <button
              className={styles.actionButton}
              onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setButtonPosition({ x: rect.left - 150, y: rect.bottom });
                onActionClick?.(data.id, e);
              }}
            >
              •••
            </button>

            {activeActionMenuId === data.id && (
              <PopupMenu
                x={buttonPosition.x}
                y={buttonPosition.y}
                onClose={() => onActionClick?.(null)}
              >
                <button
                  className={styles.archiveButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleToggleArchive(activeActionMenu);
                    onArchiveClick?.(data.id);
                  }}
                >
                  {data.isActive ? 'Archive' : 'Unarchive'}
                </button>
              </PopupMenu>
            )}
          </div>
        )}
      </td>

    </tr>
  );
};

export default TableRow;
