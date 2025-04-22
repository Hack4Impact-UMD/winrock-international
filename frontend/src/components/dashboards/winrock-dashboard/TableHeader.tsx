import React from 'react';
import styles from '../../../css-modules/TableHeader.module.css';

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  headers: string[];
  isEditMode: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ onSelectAll, allSelected = false, headers, isEditMode }) => {
  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th className={styles.checkboxCell}>
          <div className={`${styles.checkboxWrapper} ${!isEditMode ? styles.hidden : ''}`}>
            <input 
              type="checkbox" 
              onChange={(e) => onSelectAll?.(e.target.checked)}
              checked={allSelected}
              className={styles.checkbox}
              disabled={!isEditMode}
            />
          </div>
        </th>
        {headers.map((header, index) => (
          <th key={index} className={styles.headerCell}>
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader; 