import React from 'react';
import styles from '../../../css-modules/TableHeader.module.css';

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ onSelectAll, allSelected = false }) => {
  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th className={styles.checkboxCell}>
          <div className={styles.checkboxWrapper}>
            <input 
              type="checkbox" 
              onChange={(e) => onSelectAll?.(e.target.checked)}
              checked={allSelected}
              className={styles.checkbox}
            />
          </div>
        </th>
        <th className={styles.headerCell}>Project</th>
        <th className={styles.headerCell}>Supplier</th>
        <th className={styles.headerCell}>Overall Status</th>
        <th className={styles.headerCell}>Analysis stage</th>
        <th className={styles.headerCell}>Spend Category</th>
        <th className={styles.headerCell}>Geography</th>
        <th className={styles.headerCell}>Last Updated</th>
        <th className={styles.headerCell}>Start Date</th>
        <th className={styles.headerCell}>Action</th>
      </tr>
    </thead>
  );
};

export default TableHeader; 