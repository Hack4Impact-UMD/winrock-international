import React, { useState } from 'react';
import styles from '../css-modules/WinrockDashboard.module.css';
import winrockLogo from '../assets/winrock-international-logo.png';
import { ReactComponent as ProjectsIcon } from '../assets/projects-icon.svg';
import { ReactComponent as NotificationIcon } from '../assets/notification-icon.svg';
import { ReactComponent as AccountSettingsIcon } from '../assets/account-settings-icon.svg';
import FilterTabs from '../components/dashboards/winrock-dashboard/FilterTabs';
import Pagination from '../components/dashboards/winrock-dashboard/Pagination';
import TableHeader from '../components/dashboards/winrock-dashboard/TableHeader';
import FilterWrapper from '../components/dashboards/winrock-dashboard/FilterWrapper';
import SortWrapper from '../components/dashboards/winrock-dashboard/SortWrapper'; 
import DateFilter from '../components/dashboards/winrock-dashboard/DateFilter';
import ColorText from '../components/dashboards/winrock-dashboard/ColorText';
import TableRow from '../components/dashboards/winrock-dashboard/TableRow';


interface Project {
  id: number;
  project: string;
  supplier: string;
  overallStatus: 'On Track' | 'At Risk' | 'Paused' | 'Completed' | 'Completed (except for risk)';
  analysisStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded';
  spendCategory: string;
  geography: string;
  lastUpdated: string;
  startDate: string;
  activityType: 'Renewable Energy and Energy Efficiency' | 'Agriculture' | 'Agroforestry' | 'Animal Agriculture and Manure Management';
}

const sampleProjects: Project[] = [
  {
    id: 1,
    project: 'Nestlé',
    supplier: 'Cargill',
    overallStatus: 'On Track',
    analysisStage: 'Risk & Co-benefit Assessment',
    spendCategory: 'Cereals & Grains',
    geography: 'United States of America',
    lastUpdated: '6 days',
    startDate: '03/15/2023',
    activityType: 'Agriculture'
  },
  {
    id: 2,
    project: 'McCormick',
    supplier: 'Orange',
    overallStatus: 'At Risk',
    analysisStage: 'GHG Assessment Analysis',
    spendCategory: 'Commodities',
    geography: 'Sweden',
    lastUpdated: '30 days',
    startDate: '03/15/2025',
    activityType: 'Agriculture'
  },
  {
    id: 3,
    project: 'Microsoft',
    supplier: 'Kiwi',
    overallStatus: 'Paused',
    analysisStage: 'Confirming Final Requirements',
    spendCategory: 'Fruits & Berries',
    geography: 'Sweden',
    lastUpdated: '2 days',
    startDate: '03/15/2021',
    activityType: 'Renewable Energy and Energy Efficiency'
  },
  {
    id: 4,
    project: 'WebMD',
    supplier: 'Apple',
    overallStatus: 'Completed',
    analysisStage: 'Clarifying Initial Project Information',
    spendCategory: 'Commodities',
    geography: 'China',
    lastUpdated: '12 days',
    startDate: '03/15/2023',
    activityType: 'Agroforestry'
  },
  {
    id: 5,
    project: 'Kellogg',
    supplier: 'Grape',
    overallStatus: 'Completed (except for risk)',
    analysisStage: 'Complete, and Excluded',
    spendCategory: 'Commodities',
    geography: 'Sweden',
    lastUpdated: '6 days',
    startDate: '03/15/2023',
    activityType: 'Agriculture'
  },
  {
    id: 6,
    project: 'Lululemon',
    supplier: 'Orange',
    overallStatus: 'On Track',
    analysisStage: 'Clarifying Initial Project Information',
    spendCategory: 'Coco',
    geography: 'Indonesia',
    lastUpdated: '42 days',
    startDate: '03/15/2019',
    activityType: 'Agroforestry'
  },
  {
    id: 7,
    project: 'Cheetos',
    supplier: 'Orange',
    overallStatus: 'On Track',
    analysisStage: 'Risk & Co-benefit Assessment',
    spendCategory: 'Commodities',
    geography: 'South Africa',
    lastUpdated: '6 days',
    startDate: '03/15/2022',
    activityType: 'Agriculture'
  },
  {
    id: 8,
    project: 'Cheezits',
    supplier: 'Orange',
    overallStatus: 'Paused',
    analysisStage: 'Confirming Final Requirements',
    spendCategory: 'Spices',
    geography: 'Bangladesh',
    lastUpdated: '1 day',
    startDate: '03/15/2015',
    activityType: 'Agriculture'
  },
  {
    id: 9,
    project: 'Cheerios',
    supplier: 'Orange',
    overallStatus: 'Paused',
    analysisStage: 'Clarifying Initial Project Information',
    spendCategory: 'Electricity',
    geography: 'Sweden',
    lastUpdated: '6 days',
    startDate: '03/15/2022',
    activityType: 'Renewable Energy and Energy Efficiency'
  },
  {
    id: 10,
    project: 'McCormick',
    supplier: 'Orange',
    overallStatus: 'Paused',
    analysisStage: 'Risk & Co-benefit Assessment',
    spendCategory: 'Commodities',
    geography: 'Norway',
    lastUpdated: '6 days',
    startDate: '03/15/2023',
    activityType: 'Agriculture'
  },
  {
    id: 11,
    project: 'Tesla',
    supplier: 'Lithium Corp',
    overallStatus: 'At Risk',
    analysisStage: 'GHG Assessment Analysis',
    spendCategory: 'Electricity',
    geography: 'Australia',
    lastUpdated: '15 days',
    startDate: '04/01/2023',
    activityType: 'Renewable Energy and Energy Efficiency'
  },
  {
    id: 12,
    project: 'Starbucks',
    supplier: 'Coffee Beans Co',
    overallStatus: 'On Track',
    analysisStage: 'Confirming Final Requirements',
    spendCategory: 'Commodities',
    geography: 'Brazil',
    lastUpdated: '3 days',
    startDate: '02/28/2024',
    activityType: 'Agriculture'
  },
  {
    id: 13,
    project: 'Nike',
    supplier: 'Cotton Express',
    overallStatus: 'Completed',
    analysisStage: 'Complete, and Excluded',
    spendCategory: 'Textiles',
    geography: 'India',
    lastUpdated: '20 days',
    startDate: '01/15/2023',
    activityType: 'Animal Agriculture and Manure Management'
  },
  {
    id: 14,
    project: 'Samsung',
    supplier: 'Green Energy Ltd',
    overallStatus: 'Completed (except for risk)',
    analysisStage: 'Risk & Co-benefit Assessment',
    spendCategory: 'Electronics',
    geography: 'South Korea',
    lastUpdated: '8 days',
    startDate: '03/10/2024',
    activityType: 'Renewable Energy and Energy Efficiency'
  },
  {
    id: 15,
    project: 'Unilever',
    supplier: 'Palm Oil Inc',
    overallStatus: 'At Risk',
    analysisStage: 'Clarifying Initial Project Information',
    spendCategory: 'Oils & Fats',
    geography: 'Malaysia',
    lastUpdated: '4 days',
    startDate: '03/20/2024',
    activityType: 'Animal Agriculture and Manure Management'
  }
];


const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [activeSideButton, setActiveSideButton] = useState('Projects');
  const [selectedSort, setSelectedSort] = useState('newest-first'); // Starting with the option shown in your image
  
  const itemsPerPage = 10;
  
  // Filter projects by selected activity type
  const filteredProjects = selectedTab === 'All Projects' 
    ? projects 
    : projects.filter(project => project.activityType === selectedTab);
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the current page's projects from filtered projects
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  //date filter consts
  interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
  }
  
  const [dateFilter, setDateFilter] = useState<DateRange>({
    startDate: null,
    endDate: null
  });

  // Reset to first page when changing tabs
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    setSelectedRows([]); // Clear selected rows when changing tabs
  };
  
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

  const handleRowSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleFieldChange = (id: number, field: keyof Project, value: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  // per category
  
  // Handler for sort selection - just updates the state
  const handleSortChange = (sortOption: string) => {
    setSelectedSort(sortOption);
  };

  // // per category
  // const renderFilterContent = (sectionKey: string) => {
  //   let categories;
    
  //   if (sectionKey === 'status') {
  //     categories = overallCategories;
  //   } else if (sectionKey === 'spend') {
  //     categories = spendCategories;
  //   } else if (sectionKey === 'date') {
  //     categories = dateCategories;
  //   } else {
  //     return null;
  //   }
    
  //   return (
  //     <div className={styles.filterOptions}>
  //       {categories.map(option => (
  //         <div key={option.id} className={styles.checkboxItem}>
  //           <input 
  //             type="checkbox"
  //             id={`${sectionKey}-${option.id}`}
  //             checked={selectedCategories.includes(option.id)}
  //             onChange={() => toggleCategory(option.id)}
  //           />
  //           <label htmlFor={`${sectionKey}-${option.id}`}>
  //             {sectionKey === 'status' && (
  //               <span className={`${styles.statusIndicator} ${styles[option.id]}`}></span>
  //             )}
  //             {option.label}
  //           </label>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  
  
  const renderFilterContent = (sectionKey: string) => {
    if (sectionKey === 'status') {
      return (
        <div className={styles.filterOptions}>
          {overallCategories.map(option => (
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
    } else if (sectionKey === 'spend') {
      return (
        <div className={styles.filterOptions}>
          {spendCategories.map(option => (
            <div key={option.id} className={styles.checkboxItem}>
              <input
                type="checkbox"
                id={`${sectionKey}-${option.id}`}
                checked={selectedCategories.includes(option.id)}
                onChange={() => toggleCategory(option.id)}
              />
              <label htmlFor={`${sectionKey}-${option.id}`}>{option.label}</label>
            </div>
          ))}
        </div>
      );
    } else if (sectionKey === 'date') {
      // Return the DateFilter component for date filtering
      return (
        <DateFilter
          onFilterChange={(dateRange) => {
            // Make sure this state updater function is defined in your component
            setDateFilter({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
            });
            
            // Reset to first page when filter changes
            setCurrentPage(1);
            
            // Close the filter popup if needed
            if (isFilterPopupOpen) {
              toggleFilterPopup();
            }
          }}
        />
      );
    }
    
    return null;
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
        <div className={styles.sideButtonsContainer}>
          <button 
            className={`${styles.sideButton} ${activeSideButton === 'Projects' ? styles.active : ''}`}
            onClick={() => setActiveSideButton('Projects')}
          >
            <ProjectsIcon />
            Projects
          </button>
          <button 
            className={`${styles.sideButton} ${activeSideButton === 'Notification Center' ? styles.active : ''}`}
            onClick={() => setActiveSideButton('Notification Center')}
          >
            <NotificationIcon />
            Notification Center
          </button>
          <button 
            className={`${styles.sideButton} ${activeSideButton === 'Account Settings' ? styles.active : ''}`}
            onClick={() => setActiveSideButton('Account Settings')}
          >
            <AccountSettingsIcon />
            Account Settings
          </button>

        </div>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Projects</h1>
        
        <div className={styles.tabsContainer}>
          <FilterTabs
            tabs={tabs}
            selectedTab={selectedTab}
            onTabSelect={handleTabChange}
          />
          <button 
            className={`${styles.editButton} ${isEditMode ? styles.active : ''}`} 
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>

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
            
            {/* Our updated SortWrapper component */}
            <SortWrapper 
              onSortChange={handleSortChange}
              initialSortOption={selectedSort}
            />
            
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
          <table className={styles.table}>
            <TableHeader />
            <tbody>
              {currentProjects.map(project => (
                <TableRow
                  key={project.id}
                  data={project}
                  isSelected={selectedRows.includes(project.id)}
                  onSelect={(checked) => handleRowSelect(project.id, checked)}
                  isEditMode={isEditMode}
                  onFieldChange={(field, value) => handleFieldChange(project.id, field, value)}
                />
              ))}
            </tbody>
          </table>
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
  'All Projects',
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
  { id: 'onTrack', label: <ColorText text="On Track" category="On Track" variant="status" /> },
  { id: 'atRisk', label: <ColorText text="At Risk" category="At Risk" variant="status" /> },
  { id: 'paused', label: <ColorText text="Paused" category="Paused" variant="status" /> },
  { id: 'completed', label: <ColorText text="Completed" category="Completed" variant="status" /> },
  { id: 'completedRisk', label: <ColorText text="Completed (except for risk)" category="Completed (except for risk)" variant="status" /> }
];


export default WinrockDashboard;