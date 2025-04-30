import React from 'react';
import styles from '../css-modules/TableHeader.module.css';

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
        {/* Checkbox Column */}
        <th className={styles.checkboxCell}>
          {isEditMode && (
            <input
              type="checkbox"
              onChange={(e) => onSelectAll?.(e.target.checked)}
              checked={allSelected}
              className={styles.checkbox}
            />
          )}
        </th>

        {/* Other Headers */}
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
