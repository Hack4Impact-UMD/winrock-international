import React, { useState } from 'react';
import styles from '../css-modules/ReportsDropdown.module.css';

interface ReportsDropdownProps {
  children?: React.ReactNode;
}

const ReportsDropdown: React.FC<ReportsDropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button 
        className={`${styles.dropdownBar} ${isOpen ? styles.active : ''}`}
        onClick={toggleDropdown}
      >
        <span>Reports</span>
        <span className={styles.arrow}>
          {isOpen ? (
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="9.5" x2="19" y2="9.5" stroke="#005293" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="9.5" y1="1" x2="9.5" y2="18" stroke="#005293" strokeWidth="2" strokeLinecap="round"/>
              <line x1="0" y1="9.5" x2="19" y2="9.5" stroke="#005293" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownContent}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ReportsDropdown; 