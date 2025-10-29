import React from 'react';
import styles from '../css-modules/TableHeader.module.css';

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  headers: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ onSelectAll, allSelected = false, headers }) => {
  return (
    <thead className={styles.tableHeader}>
      <tr>
        {/* Checkbox Column */}
        <th className={styles.checkboxCell}>
          <div className={`${styles.checkboxWrapper} ${styles.hidden}`}>
            <input
              type="checkbox"
              onChange={(e) => onSelectAll?.(e.target.checked)}
              checked={allSelected}
              className={styles.checkbox}
            />
          </div>
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
