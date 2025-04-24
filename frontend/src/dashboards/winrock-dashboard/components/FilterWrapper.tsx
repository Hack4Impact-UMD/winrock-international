import React, { ReactNode, useState } from 'react';
import styles from '../css-modules/FilterWrapper.module.css';

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

// Individual filter section 
export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isExpanded = false,
  onToggle = () => {},
}) => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.sectionHeader} onClick={onToggle}>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.expandIcon}>{isExpanded ? '-' : '+'}</span>
      </div>
      {isExpanded && (
        <div className={styles.sectionContent}>
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterWrapperProps {
  children?: (sectionKey: string) => ReactNode;
  title?: string;
}

// Main wrapper part
const FilterWrapper: React.FC<FilterWrapperProps> = ({
  children,
  title = 'Filters'
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(); 

  const toggleSection = (sectionTitle: string) => {
    if (expandedSection === sectionTitle) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionTitle);
    }
  };

  // Filter sections
  const filterSections = [
    { title: 'Overall Status', key: 'status' },
    { title: 'Spend Category', key: 'spend' },
    { title: 'Date', key: 'date' }
  ];

  return (
    <div className={styles.filterWrapper}>
      
      <div className={styles.filtersContainer}>
        {filterSections.map((section) => (
          <FilterSection
            key={section.key}
            title={section.title}
            isExpanded={expandedSection === section.key}
            onToggle={() => toggleSection(section.key)}
          >
            {children && children(section.key)}
          </FilterSection>
        ))}
      </div>
    </div>
  );
};

export default FilterWrapper;