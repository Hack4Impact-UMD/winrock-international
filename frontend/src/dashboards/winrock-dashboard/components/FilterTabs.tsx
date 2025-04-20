import React from 'react';
import styles from '../css-modules/FilterTabs.module.css'

interface FilterTabsProps {
  tabs: string[];
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, selectedTab, onTabSelect }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button
          key={tab}
          className={`${styles.tab} `}
          onClick={() => onTabSelect(tab)}
        >
          <p className={selectedTab === tab ? styles.activeTab : ''}>{tab}</p>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs; 