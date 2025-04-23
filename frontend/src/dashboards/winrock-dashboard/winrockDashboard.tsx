import React, { useState, useEffect } from 'react';
import styles from './css-modules/WinrockDashboard.module.css';
import winrockLogo from '../../assets/winrock-international-logo.png';
import projectsIcon from '../../assets/projects-icon.svg';
import notificationIcon from '../../assets/notification-icon.svg';
import accountSettingsIcon from '../../assets/account-settings-icon.svg';
import FilterTabs from './components/FilterTabs';
import Pagination from './components/Pagination';
import TableHeader from './components/TableHeader';
import FilterWrapper from './components/FilterWrapper';
import SortWrapper from './components/SortWrapper';
import DateFilter from './components/DateFilter';
import ColorText from './components/ColorText';
import TableRow from './components/TableRow';
import { getAllProjects, updateProjectField } from "./winrockDashboardService"
import { orderBy } from 'firebase/firestore';


interface Project {
  id: number;
  project: string;
  supplierName: string;
  overallStatus: 'On Track' | 'At Risk' | 'Paused' | 'Completed' | 'Completed (except for risk)';
  analysisStage: 'Risk & Co-benefit Assessment' | 'GHG Assessment Analysis' | 'Confirming Final Requirements' | 'Clarifying Initial Project Information' | 'Complete, and Excluded';
  spendCategory: string;
  geography: string;
  lastUpdated: string;
  startDate: string;
  activityType: 'Renewable Energy and Energy Efficiency' | 'Agriculture' | 'Agroforestry' | 'Animal Agriculture and Manure Management';
}

async function fetchProjects(): Promise<Project[]> {
  const result = await getAllProjects("projectName", false);

  if (!result.success || !result.data?.projects) {
    throw new Error("Failed to fetch projects");
  }

  return result.data.projects.map((p: any, index: number) => ({
    id: index,
    project: typeof p.projectName === 'string' ? (p.projectName.charAt(0).toUpperCase() + p.projectName.slice(1)) : "Unknown Project",
    supplierName: typeof p.supplierName === 'string' ? (p.supplierName.charAt(0).toUpperCase() + p.supplierName.slice(1)) : "Unknown Supplier",
    overallStatus: p.overallStatus,
    analysisStage: typeof p.analysisStage === 'string' && p.analysisStage.includes(':')
      ? p.analysisStage.split(':')[1].trim()
      : p.analysisStage,
    spendCategory: p.spendCategory,
    geography: p.geography,
    lastUpdated: typeof p.lastUpdated === 'string' ? p.lastUpdated : new Date(p.lastUpdated).toISOString().split("T")[0],
    startDate: typeof p.startDate === 'string' ? p.startDate : new Date(p.startDate).toISOString().split("T")[0],
    activityType: 'Renewable Energy and Energy Efficiency', // TODO: update if backend supports this
  }));
}


const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  //const [projects, setProjects] = useState<Project[]>(allProjects);
  const [activeNavButton, setActiveNavButton] = useState('Projects');
  const [selectedSort, setSelectedSort] = useState('newest-first'); // Starting with the option shown in your image
  const [allSelected, setAllSelected] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load projects");
        setLoading(false);
      });
  }, []);


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
  console.log(projects)
  const handleFieldChange = (
    id: number,
    field: keyof Project,
    value: Project[keyof Project]
  ) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );

    const project = projects.find(p => p.id === id);
    if (!project) return;

    updateProjectField(project.project, field, value); // replace `name` with the actual key
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


  const handleSelectAll = (checked: boolean) => {
    // TODO: select all checkboxes
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
        <div className={styles.headerNavContainer}>
          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Projects' ? styles.active : ''}`}
            onClick={() => setActiveNavButton('Projects')}
          >
            <img src={projectsIcon} alt="Projects" />
            Projects
          </button>
          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Notification Center' ? styles.active : ''}`}
            onClick={() => setActiveNavButton('Notification Center')}
          >
            <img src={notificationIcon} alt="Notification Center" />
            Notification Center
          </button>
          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Account Settings' ? styles.active : ''}`}
            onClick={() => setActiveNavButton('Account Settings')}
          >
            <img src={accountSettingsIcon} alt="Account Settings" />
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
        {loading && <p>Loading projects...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <TableHeader
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              headers={['Project', 'Supplier', 'Overall Status', 'Analysis stage', 'Spend Category', 'Geography', 'Last Updated', 'Start Date', 'Action']}
              isEditMode={isEditMode}
            />
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