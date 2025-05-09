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
import DateFilter, { DateRange } from '../components/DateFilter';
import ColorText from '../components/ColorText';
import TableRow from '../components/TableRow';
import ReportsDropdown from '../components/ReportsDropdown';
import KPICharts from '../components/KPICharts';
import { getAllProjects, updateProjectField } from "./winrockDashboardService";
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";

interface Project {
  id: string;
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

const WinrockDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<{
    status: string[];
    spend: string[];
  }>({
    status: [],
    spend: [],
  });
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<String[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeNavButton, setActiveNavButton] = useState('Projects');
  const [selectedSort, setSelectedSort] = useState('newest-first');
  const [allSelected, setAllSelected] = useState(false);
  const [editableProjects, setEditableProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const navigate = useNavigate();

  // These are used to control the date, i.e. save changes to the date filter calendar
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: new Date()
  });

  const handleActionClick = (id: string | null) => {
      setActiveActionMenu(id);
  };

  const mapStatusToId = (status: string): string => {
    const mapping: Record<string, string> = {
      "On Track": "onTrack",
      "At Risk": "atRisk",
      "Paused": "paused",
      "Completed": "completed",
      "Completed (except for risk)": "completedRisk"
    };
    return mapping[status] || status;
  };
  const handleToggleArchive = async (projectId: string) => {
    const project = projects.find(p => p.id === String(projectId));
    
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }

    const newIsActive = !project.isActive;

    try {
      await handleSaveProject(project.project, { isActive: newIsActive });

      setActiveActionMenu(null);


      setProjects(prev => prev.map(p =>
        p.id === String(projectId) ? { ...p, isActive: newIsActive } : p
      ));
    } catch (error) {
      console.error(`Failed to update project:`, error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("projectName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc, index) => {
        const p = doc.data();
        const parseDate = (date: any) => {
          if (!date) return "";
          if (date.toDate) {
            return date.toDate().toISOString().split("T")[0];
          }
          const parsed = new Date(date);
          if (isNaN(parsed.getTime())) {

            return "";
          }
          return parsed.toISOString().split("T")[0];
        };
        return {
          id: doc.id,
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
          activityType: p.activityType,
          isActive: typeof p.isActive === 'boolean' ? p.isActive : true,
        } as Project;
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to projects:", error);
      setError("Failed to load projects");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const itemsPerPage = 10;

  const filteredProjects = selectedTab === 'All Projects'
    ? projects
    : projects.filter(project => project.activityType === selectedTab);
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredAndVisibleProjects = useMemo(() => {
    return projects
      .filter(p => viewMode === 'active' ? p.isActive : !p.isActive)
      .filter(p => selectedTab === 'All Projects' ? true : p.activityType === selectedTab)
      .filter(p => {
        const matchesStatus =
          activeFilters.status.length === 0 || activeFilters.status.includes(mapStatusToId(p.overallStatus));
        const matchesSpend =
          activeFilters.spend.length === 0 || activeFilters.spend.includes(p.spendCategory);
        return matchesStatus && matchesSpend;
      })
      .filter(p => {
        // TODO: There's a bug causing the date to be a day off, we should fix this later
        let trueStartDate = new Date(p.startDate);
        trueStartDate.setDate(trueStartDate.getDate() + 1);
        if (dateRange.startDate && trueStartDate < dateRange.startDate) return false;
        if (dateRange.endDate && trueStartDate > dateRange.endDate) return false;
        return true;
      })
      .filter(p =>
        searchQuery.trim() === '' ||
        p.project.toLowerCase().startsWith(searchQuery.trim().toLowerCase())
      );;
  }, [projects, viewMode, selectedTab, activeFilters, dateRange, searchQuery]);

  // Memoize currentProjects (paging the visibleProjects)
  const currentProjects = useMemo(() => {
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    return filteredAndVisibleProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [filteredAndVisibleProjects, currentPage]);

  // Reset to first page when changing tabs
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1);
    setSelectedRows([]); // Clear selected rows when changing tabs
  };

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };

  const toggleCategory = (section: 'status' | 'spend', categoryId: string) => {
    setActiveFilters(prev => {
      const current = prev[section];
      const updated = current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId];
      return { ...prev, [section]: updated };
    });
    setCurrentPage(1);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
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
                checked={activeFilters.status.includes(option.id)}
                onChange={() => toggleCategory('status', option.id)}
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
                checked={activeFilters.spend.includes(option.id)}
                onChange={() => toggleCategory('spend', option.id)}
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
          onDateRangeChange={(newDateRange) => {
            setDateRange(newDateRange);

            setCurrentPage(1);

            if (isFilterPopupOpen) {
              toggleFilterPopup();
            }
          }}
          controlledDateRange={dateRange}
        />
      );
    }

    return null;
  };


  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    if (checked) {
      // Select all visible rows on current page
      const visibleIds = currentProjects.map(p => p.id);
      setSelectedRows(visibleIds);
    } else {
      // Deselect all
      setSelectedRows([]);
    }
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
            onClick={async () => {
              if (isEditMode) {
                // ✅ Save changes before exiting edit mode
                for (const edited of editableProjects) {
                  const original = projects.find(p => p.id === edited.id);
                  if (!original) continue;

                  const updatedFields: Partial<Project> = {};

                  // Compare fields and collect differences
                  for (const key in edited) {
                    if (edited[key as keyof Project] !== original[key as keyof Project]) {
                      updatedFields[key as keyof Project] = edited[key as keyof Project];
                    }
                  }

                  // Save only if there are changes
                  if (Object.keys(updatedFields).length > 0) {
                    await handleSaveProject(edited.project, updatedFields);
                  }
                }

                setEditableProjects([]);
              } else {
                // Going into edit mode
                setEditableProjects(JSON.parse(JSON.stringify(currentProjects)));
              }

              setIsEditMode(!isEditMode);
            }}
          >
            {isEditMode ? 'Done' : 'Edit'}
          </button>

        </div>

        <div className={styles.toolbarContainer}>
          <div className={styles.searchContainer}>
            <img src={searchIcon} alt="Search" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {(isEditMode ? editableProjects : currentProjects).map(project => (
                <TableRow
                  key={project.id}
                  data={project}
                  isSelected={selectedRows.includes(project.id)}
                  onSelect={(checked) => handleRowSelect(project.id, checked)}
                  isEditMode={isEditMode}
                  onSave={(updatedFields) => {
                    if (isEditMode) {
                      setEditableProjects(prev =>
                        prev.map(p => p.id === project.id ? { ...p, ...updatedFields } : p)
                      );
                    } else {
                      handleSaveProject(project.project, updatedFields);
                    }
                  }}

                  onActionClick={handleActionClick}
                  onArchiveClick={handleToggleArchive} activeActionMenuId={activeActionMenu}  // 👈 here
                  onRowClick={() => {
                    navigate(`/dashboard/admin/projects/${project.id}`, { state: { project } });
                  }}
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

const spendCategories = [
  { id: 'Acids & Alkalis', label: 'Acids & Alkalis' },
  { id: 'Animal Products', label: 'Animal Products' },
  { id: 'Cereals & Grains', label: 'Cereals & Grains' },
  { id: 'Commodities', label: 'Commodities' },
  { id: 'Cocoa', label: 'Cocoa' },
  { id: 'Electricity', label: 'Electricity' },
  { id: 'Emulsifiers', label: 'Emulsifiers' },
];

const overallCategories = [
  { id: 'onTrack', label: <ColorText text="On Track" category="On Track" variant="status" /> },
  { id: 'atRisk', label: <ColorText text="At Risk" category="At Risk" variant="status" /> },
  { id: 'paused', label: <ColorText text="Paused" category="Paused" variant="status" /> },
  { id: 'completed', label: <ColorText text="Completed" category="Completed" variant="status" /> },
  { id: 'completedRisk', label: <ColorText text="Completed (except for risk)" category="Completed (except for risk)" variant="status" /> }
];

export default WinrockDashboard;
