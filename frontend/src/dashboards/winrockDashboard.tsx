import React, { useState } from 'react';
import styles from '../css-modules/WinrockDashboard.module.css';
import winrockLogo from '../assets/winrock-international-logo.png';
import FilterTabs from '../components/dashboards/winrock-dashboard/FilterTabs';
import Pagination from '../components/dashboards/winrock-dashboard/Pagination';
import TableHeader from '../components/dashboards/winrock-dashboard/TableHeader';
import FilterWrapper from '../components/dashboards/winrock-dashboard/FilterWrapper';
import ColorText from '../components/dashboards/winrock-dashboard/ColorText';

const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Renewable Energy and Energy Efficiency');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  
  const itemsPerPage = 10;
  const totalItems = 74; 
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // toggle 
  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };
  
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    setCurrentPage(1);
  };

  // per category
  const renderFilterContent = (sectionKey: string) => {
    let categories;
    
    if (sectionKey === 'status') {
      categories = overallCategories;
    } else if (sectionKey === 'spend') {
      categories = spendCategories;
    } else if (sectionKey === 'date') {
      categories = dateCategories;
    } else {
      return null;
    }
    
    return (
      <div className={styles.filterOptions}>
        {categories.map(option => (
          <div key={option.id} className={styles.checkboxItem}>
            <input 
              type="checkbox"
              id={`${sectionKey}-${option.id}`}
              checked={selectedCategories.includes(option.id)}
              onChange={() => toggleCategory(option.id)}
            />
            <label htmlFor={`${sectionKey}-${option.id}`}>
              {sectionKey === 'status' && (
                <span className={`${styles.statusIndicator} ${styles[option.id]}`}></span>
              )}
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Projects</h1>
        
        <FilterTabs
          tabs={tabs}
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab}
        />

        <div className={styles.toolbarContainer}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search projects..." 
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterContainer}>
            <button 
              className={`${styles.filterButton} ${isFilterPopupOpen ? styles.active : ''}`}
              onClick={toggleFilterPopup}
            >
              Filter
            </button>
            <button className={styles.sortButton}>Sort</button>
            
            {isFilterPopupOpen && (
              <div className={styles.filterPopup}>
                <FilterWrapper title="Filters">
                  {(sectionKey) => renderFilterContent(sectionKey)}
                </FilterWrapper>
              </div>
            )}
          </div>
        </div>

        <div className={styles.tableContainer}>
          <TableHeader />
          {}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

const tabs = [
  'Renewable Energy and Energy Efficiency',
  'Agriculture',
  'Agroforestry',
  'Animal Agriculture and Manure Management'
];

// options for the dropdowns
const spendCategories = [
  { id: 'acids', label: 'Acids & Alkalis' },
  { id: 'animal-products', label: 'Animal Products' },
  { id: 'cereals', label: 'Cereals & Grains' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'cocoa', label: 'Cocoa' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'emulsifiers', label: 'Emulsifiers' },
];

const overallCategories = [
  { id: 'onTrack', label: <ColorText text="On Track" backgroundColor="#e6f4ff" textColor="#0a3977" />},
  { id: 'atRisk', label: <ColorText text="At Risk" backgroundColor="#fde7e9" textColor="#e41b35" />},
  { id: 'paused', label: <ColorText text="Paused" backgroundColor="#fff8e6" textColor="#b07d18" />},
  { id: 'completed', label: <ColorText text="Completed" backgroundColor="#e6f9eb" textColor="#186a3b" />},
  { id: 'completedRisk', label: <ColorText text="Completed (except for risk)" backgroundColor="#f1fae1" textColor="#486b00" /> }];

const dateCategories = [
  { id: 'idk', label: 'idk' },
];

export default WinrockDashboard;