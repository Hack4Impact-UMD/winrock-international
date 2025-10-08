import React, { useState } from 'react';
import styles from '../../../forms/css-modules/SortWrapper.module.css';
import mainStyles from '../css-modules/SupplierDashboard.module.css';

interface SortOption {
  id: string;
  label: string;
}

interface SortWrapperProps {
  onSortChange?: (sortOption: string) => void;
  initialSortOption?: string;
}

const SortWrapper: React.FC<SortWrapperProps> = ({
  onSortChange = () => {},
  initialSortOption = 'recently-updated'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialSortOption);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    onSortChange(optionId);
    // Keeping the dropdown open to match the UI in the image
  };
  
  // Sort options with colors for the selected item
  const sortOptions: SortOption[] = [
    { id: 'recently-updated', label: 'Recently Updated' },
    { id: 'newest-first', label: 'Newest first' },
    { id: 'oldest-first', label: 'Oldest first' },
    { id: 'a-to-z', label: 'A to Z - supplier name' },
    { id: 'z-to-a', label: 'Z to A - supplier name' }
  ];
  
  return (
    <div className={styles.sortWrapperContainer}>
      <button 
        className={`${mainStyles.sortButton} ${isOpen ? mainStyles.active : ''}`}
        onClick={toggleDropdown}
      >
        Sort
      </button>
      
      {isOpen && (
        <div className={styles.sortDropdown}>
          {sortOptions.map(option => (
            <div 
              key={option.id}
              className={`${styles.sortOption} ${selectedOption === option.id ? mainStyles.selected : ''}`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <span className={selectedOption === option.id ? styles.selectedText : ''}>
                {option.label}
              </span>
              {selectedOption === option.id && (
                <span className={mainStyles.checkmark}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortWrapper;