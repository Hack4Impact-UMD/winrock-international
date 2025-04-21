import React from 'react';
import styles from '../css-modules/Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    // Always show first page
    pages.push(
      <button 
        key={1}
        onClick={() => onPageChange(1)}
        className={`${currentPage === 1 ? styles.active : ''} ${styles.pageCount}`}
      >
        1
      </button>
    );

    if (currentPage > maxVisiblePages) {
      pages.push(<span key="ellipsis1">...</span>);
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= currentPage + 1 && i >= currentPage - 1) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`${currentPage === i ? styles.active : ''} ${styles.pageCount}`}
          >
            {i}
          </button>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis2">...</span>);
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`${currentPage === totalPages ? styles.active : ''} ${styles.pageCount}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <span className={styles.pageCount}>{startItem}-{endItem} of {totalItems}</span>
      <div className={styles.paginationControls}>
        <div className={styles.rowsPerPage}>
          <span>Rows per page</span>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            min={1}
            max={100}
            className={styles.rowsInput}
          />
        </div>
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </button>
        {renderPageNumbers()}
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination; 