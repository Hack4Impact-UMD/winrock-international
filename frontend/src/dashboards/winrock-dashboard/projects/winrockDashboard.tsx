import React, { useState, useEffect, useMemo } from 'react';
import styles from "./../css-modules/WinrockDashboard.module.css"
import winrockLogo from "./../../../assets/winrock-international-logo.png"
import projectsIcon from './../../../assets/projects-icon.svg';
import notificationIcon from './../../../assets/notification-icon.svg';
import accountSettingsIcon from '../../../assets/account-settings-icon.svg';
import searchIcon from "../../../assets/search-icon.svg"
import FilterTabs from '../components/FilterTabs';
import Pagination from '../components/Pagination';
import TableHeader from '../components/TableHeader';
import FilterWrapper from '../components/FilterWrapper';
import SortWrapper from '../components/SortWrapper';
import DateFilter from '../components/DateFilter';
import ColorText from '../components/ColorText';
import TableRow from '../components/TableRow';
import ReportsDropdown from '../components/ReportsDropdown';
import KPICharts from '../components/KPICharts';
import PopupMenu from '../components/PopupMenu';
import { getAllProjects, updateProjectField } from "./winrockDashboardService";
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";

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
  isActive: boolean;
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
    activityType: 'Renewable Energy and Energy Efficiency',
    isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
  }));
}

const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeNavButton, setActiveNavButton] = useState('Projects');
  const [selectedSort, setSelectedSort] = useState('newest-first'); // Starting with the option shown in your image
  const [allSelected, setAllSelected] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const navigate = useNavigate();
  const handleActionClick = (id: number | null, event?: React.MouseEvent) => {
    console.log('handleActionClick called with id:', id);
    if (id === null) {
      setActiveActionMenu(null);
    } else {
      if (event) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setButtonPosition({ x: rect.left, y: rect.bottom });
      }
      setActiveActionMenu(id);
    }
  };
  const handleToggleArchive = async (projectId: number) => {
    console.log('handleToggleArchive called with projectId:', projectId);
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }

    const newIsActive = !project.isActive; // flip the active status
    console.log(`Setting isActive=${newIsActive} for project: ${project.project}`);

    try {
      await handleSaveProject(project.project, { isActive: newIsActive });
      console.log(`Successfully updated isActive for ${project.project}`);

      setActiveActionMenu(null);

      // Update local state
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, isActive: newIsActive } : p
      ));

      console.log(`Local state updated for project ID ${projectId}`);
    } catch (error) {
      console.error(`Failed to update project:`, error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("projectName")); // optional: order by a field if you want
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc, index) => {
        const p = doc.data();
        const parseDate = (date: any) => {
          if (!date) return ""; // empty string if missing
          if (date.toDate) {
            // Firestore Timestamp object
            return date.toDate().toISOString().split("T")[0];
          }
          const parsed = new Date(date);
          if (isNaN(parsed.getTime())) {
            // still not a valid date
            return "";
          }
          return parsed.toISOString().split("T")[0];
        };
        return {
          id: index,
          project: typeof p.projectName === 'string' ? (p.projectName.charAt(0).toUpperCase() + p.projectName.slice(1)) : "Unknown Project",
          supplierName: typeof p.supplierName === 'string' ? (p.supplierName.charAt(0).toUpperCase() + p.supplierName.slice(1)) : "Unknown Supplier",
          overallStatus: p.overallStatus,
          analysisStage: typeof p.analysisStage === 'string' && p.analysisStage.includes(':')
            ? p.analysisStage.split(':')[1].trim()
            : p.analysisStage,
          spendCategory: p.spendCategory,
          geography: p.geography,
          lastUpdated: parseDate(p.lastUpdated),
          startDate: parseDate(p.startDate),
          activityType: 'Renewable Energy and Energy Efficiency', // default if missing
          isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
        };
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to projects:", error);
      setError("Failed to load projects");
      setLoading(false);
    });

    return () => unsubscribe(); // 🚨 important: cleanup when component unmounts
  }, []);



  const itemsPerPage = 10;


  const filteredProjects = selectedTab === 'All Projects'
    ? projects
    : projects.filter(project => project.activityType === selectedTab);
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const visibleProjects = useMemo(() => {
    return projects
      .filter(p => viewMode === 'active' ? p.isActive : !p.isActive)
      .filter(p => selectedTab === 'All Projects' ? true : p.activityType === selectedTab);
  }, [projects, viewMode, selectedTab]);

  // Memoize currentProjects (paging the visibleProjects)
  const currentProjects = useMemo(() => {
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    return visibleProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [visibleProjects, currentPage]);

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

  const handleSaveProject = async (projectName: string, updatedFields: Partial<Project>) => {
    try {
      for (const [field, value] of Object.entries(updatedFields)) {
        await updateProjectField(projectName, field as keyof Project, value as any);
      }
      console.log(`Project ${projectName} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update project ${projectName}:`, error);
    }
  };

  // per category

  // Handler for sort selection - just updates the state
  const handleSortChange = (sortOption: string) => {
    const sortedProjects = [...projects]; // clone the array so you don't mutate state directly

    if (sortOption === "recently-updated") {
      sortedProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    } else if (sortOption === "newest-first") {
      sortedProjects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else if (sortOption === "oldest-first") {
      sortedProjects.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (sortOption === "a-to-z") {
      sortedProjects.sort((a, b) => b.project.localeCompare(a.project));
    } else if (sortOption === "z-to-a") {
      sortedProjects.sort((a, b) => a.project.localeCompare(b.project));
    } else {
      // fallback: maybe do nothing
    }

    setProjects(sortedProjects);
    setSelectedSort(sortOption);
  };



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
    console.log(checked)
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <img src={winrockLogo} alt="Winrock International" className={styles.logo} />
        <div className={styles.headerNavContainer}>
          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Projects' ? styles.active : ''}`}
            onClick={() => {
              setActiveNavButton('Projects');
              navigate('/dashboard/admin/projects');
            }}
          >
            <img src={projectsIcon} alt="Projects" />
            Projects
          </button>

          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Notification Center' ? styles.active : ''}`}
            onClick={() => {
              setActiveNavButton('Notification Center');
              navigate('/dashboard/admin/notification-center');
            }}
          >
            <img src={notificationIcon} alt="Notification Center" />
            Notification Center
          </button>

          <button
            className={`${styles.headerNavButton} ${activeNavButton === 'Account Settings' ? styles.active : ''}`}
            onClick={() => {
              setActiveNavButton('Account Settings');
              navigate('/dashboard/admin/account-settings');
            }}
          >
            <img src={accountSettingsIcon} alt="Account Settings" />
            Account Settings
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Projects</h1>
          <div className={styles.viewModeButtons}>
            <button className={`${styles.viewModeButton} ${viewMode === 'active' ? styles.active : ''}`} onClick={() => setViewMode('active')}>Active</button>
            <button className={`${styles.viewModeButton} ${viewMode === 'archived' ? styles.active : ''}`} onClick={() => setViewMode('archived')}>Archived</button>
          </div>
        </div>

        <ReportsDropdown>
          <KPICharts projects={projects} />
        </ReportsDropdown>
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
                  onSave={(updatedFields) => handleSaveProject(project.project, updatedFields)}
                  onActionClick={handleActionClick}
                  onArchiveClick={handleToggleArchive} activeActionMenuId={activeActionMenu}  // 👈 here
                />
              ))}
            </tbody>
          </table>
          {activeActionMenu !== null && (
            <PopupMenu
              x={buttonPosition.x}
              y={buttonPosition.y}
              onClose={() => setActiveActionMenu(null)}
            >
              <button
                className={styles.archiveButton}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Archive/Unarchive button clicked for ID:', activeActionMenu);
                  handleToggleArchive(activeActionMenu);
                }}
              >
                {projects.find(p => p.id === activeActionMenu)?.isActive ? 'Archive' : 'Unarchive'}
              </button>
            </PopupMenu>
          )}



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
