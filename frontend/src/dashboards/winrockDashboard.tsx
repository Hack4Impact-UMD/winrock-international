import React, { useState } from 'react';
import styles from '../css-modules/WinrockDashboard.module.css';
import winrockLogo from '../assets/winrock-international-logo.png';
import FilterTabs from '../components/dashboards/winrock-dashboard/FilterTabs';
import Pagination from '../components/dashboards/winrock-dashboard/Pagination';
import TableHeader from '../components/dashboards/winrock-dashboard/TableHeader';   

const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Renewable Energy and Energy Efficiency');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 74; 
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

        <div className={styles.tableContainer}>
            <TableHeader />
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

export default WinrockDashboard;