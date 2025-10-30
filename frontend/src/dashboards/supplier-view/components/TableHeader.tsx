import React from 'react';
import styles from '../css-modules/TableHeader.module.css';

interface TableHeaderProps {
  headers: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead className={styles.tableHeader}>
      <tr>
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
