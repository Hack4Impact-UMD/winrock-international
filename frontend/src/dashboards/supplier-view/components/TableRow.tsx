import React, { useState, useEffect } from 'react';
import styles from '../css-modules/TableRow.module.css';
import ColorText from '../components/ColorText';
import PopupMenu from './PopupMenu'; // ⬅️ Import the portal popup component (you need to create it too if you haven't yet)
import { useNavigate } from 'react-router-dom';

type StatusType =
  | 'On Track'
  | 'At Risk'
  | 'Paused'
  | 'Completed'
  | 'Completed (except for risk)';


interface TableRowProps {
  data: {
    id: string;
    projectName: string;
    overallStatus: StatusType;
    spendCategory: string;
    geography: string;
    lastUpdated: string;
    startDate: string;
    isActive: boolean;
  };
  onActionClick?: (id: string | null, event?: React.MouseEvent) => void; // 👈 updated here
  onArchiveClick?: (id: string) => void;
  activeActionMenuId?: string | null;
  onRowClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({
  data,
  onActionClick,         // ✅ ADD THIS
  onArchiveClick,        // ✅ ADD THIS
  activeActionMenuId,    // ✅ ADD THIS
  onRowClick,
}) => {
  // --- Local State for Editable Fields ---
  const [buttonPosition, setButtonPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const navigate = useNavigate();

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
      {/* Project Name */}
      <td
        className={`${styles.cell} ${styles.projectLink}`}
        onClick={() => {
          navigate(`/dashboard/supplier/projects/${data.projectName}`);
          onRowClick?.();
        }}
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
      >
        {data.projectName}
      </td>

      {/* Overall Status */}
      <td className={styles.cell}>
        <ColorText
          text={data.overallStatus}
          category={data.overallStatus}
          variant="status"
        />
      </td>

      {/* Spend Category */}
      <td className={styles.cell}>
        {data.spendCategory}
      </td>

      {/* Geography */}
      <td className={styles.cell}>
        {data.geography}
      </td>

      {/* Last Updated */}
      <td className={styles.cell}>{data.lastUpdated}</td>

      {/* Start Date */}
      <td className={styles.cell}>{data.startDate}</td>

      {/* Actions */}
      <td className={styles.actionCell}>
        <div className={styles.actionMenuWrapper}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setButtonPosition({ x: rect.left - 150, y: rect.bottom - 40});
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
      </td>

    </tr>
  );
};

export default TableRow;
