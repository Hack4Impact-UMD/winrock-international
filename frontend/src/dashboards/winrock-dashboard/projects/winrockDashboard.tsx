import React, { useState, useEffect, useMemo } from 'react';
import { Timestamp } from "firebase/firestore";
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
import ProjectModal from '../components/ProjectModal';
import LoginPopup from '../components/LoginPopup/Login.js';
import { isSupplierTokenValid, updateProjectField } from "./winrockDashboardService";
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebaseConfig.js";
import { Project } from '../../../types/Project'


declare global {
  interface Window {
    __autoArchivedOnce?: boolean;
  }
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeNavButton, setActiveNavButton] = useState('Projects');
  const [selectedSort, setSelectedSort] = useState('newest-first');
  const [allSelected, setAllSelected] = useState(false);
  const [editableProjects, setEditableProjects] = useState<Project[]>([]);
  const [editedProjectIds, setEditedProjectIds] = useState<Set<string>>(new Set());
  const [originalProjects, setOriginalProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const [supplierToken, setSupplierToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // These are used to control the date, i.e. save changes to the date filter calendar
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: new Date('2099-12-31') //TEMP CHANGE
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
      await handleSaveProject(project.id, { isActive: newIsActive });

      setActiveActionMenu(null);


      setProjects(prev => prev.map(p =>
        p.id === String(projectId) ? { ...p, isActive: newIsActive } : p
      ));
    } catch (error) {
      console.error(`Failed to update project:`, error);
    }
  };

  const itemsPerPage = 10;

  // const filteredProjects = selectedTab === 'All Projects'
  //   ? projects
  //   : projects.filter(project => project.activityType === selectedTab);
  // const totalItems = filteredProjects.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        p.projectName.toLowerCase().startsWith(searchQuery.trim().toLowerCase())
      );;
  }, [projects, viewMode, selectedTab, activeFilters, dateRange, searchQuery]);

  const totalItems = filteredAndVisibleProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  // Define which fields can be updated (exclude projectName and id)
  type UpdatableProjectFields = Exclude<keyof Project, 'id'>;
  const handleSaveProject = async (
    docId: string,
    updatedFields: Partial<Record<UpdatableProjectFields, Project[UpdatableProjectFields]>>
  ) => {
    try {
      const updateData: Record<string, any> = {};

      for (const [key, rawValue] of Object.entries(updatedFields).filter(
        ([k]) => k !== 'id'
      )) {
        let value: any = rawValue;

        // Convert Date to Firestore Timestamp
        if (value instanceof Date) {
          value = Timestamp.fromDate(value);
        }

        updateData[key] = value;
      }

      // Make a single write with all fields
      if (Object.keys(updateData).length > 0) {
        await updateProjectField(docId, updateData);
      }
    } catch (error) {
      console.error(`Failed to update project ${docId}:`, error);
    }
  };

  // Map Firestore analysisStage enum to frontend-friendly string
  const mapAnalysisStage = (stage: string): string => {
    switch (stage) {
      case "Stage 1: Clarifying Initial Project Information": return "Clarifying Initial Project Information";
      case "Stage 2: Clarifying Technical Details": return "Clarifying Technical Details";
      case "Stage 3: GHG Assessment Analysis": return "GHG Assessment Analysis";
      case "Stage 4: Confirming Final Requirements": return "Confirming Final Requirements";
      case "Stage 5: Risk & Co-benefit Assessment": return "Risk & Co-benefit Assessment";
      case "Stage 6: Complete, and Excluded": return "Complete, and Excluded";
      default: return stage;
    }
  };


  // Firestore snapshot mapping
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("projectName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firebase snapshot received, doc count:", snapshot.docs.length);

      const projectsData: Project[] = snapshot.docs.map((doc) => {
        const p = doc.data() as Project;

        const parseDate = (date: any) => {
          if (!date) return "";
          if (date.toDate) return date.toDate().toISOString().split("T")[0];
          const parsed = new Date(date);
          if (isNaN(parsed.getTime())) return "";
          return parsed.toISOString().split("T")[0];
        };

        return {
          id: doc.id, // local frontend ID for table rendering
          projectName: p.projectName.charAt(0).toUpperCase() + p.projectName.slice(1),
          clientName: p.clientName.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          supplierName: p.supplierName.charAt(0).toUpperCase() + p.supplierName.slice(1),
          overallStatus: p.overallStatus,
          analysisStage: mapAnalysisStage(p.analysisStage as string),
          spendCategory: p.spendCategory,
          geography: p.geography,
          lastUpdated: parseDate(p.lastUpdated),
          startDate: parseDate(p.startDate),
          notes: p.notes || "",
          activityType: p.activityType,
          isActive: p.isActive,
          isPinned: p.isPinned,
          isLocked: p.isLocked || false,
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

  //automatic archiving if the project is completed
  useEffect(() => {
    const autoArchiveCompleted = async () => {
      const completedProjects = projects.filter(
        (p) => p.overallStatus === "Completed" && p.isActive === true
      );

      for (const project of completedProjects) {
        await handleSaveProject(project.id, { isActive: false });
        console.log(`Auto-archived completed project: ${project.projectName}`);
      }
    };

    if (projects.length > 0) {
      // Use a flag to avoid re-running multiple times
      if (!window.__autoArchivedOnce) {
        window.__autoArchivedOnce = true;
        autoArchiveCompleted();
      }
    }
  }, [projects]);
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
      sortedProjects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    } else if (sortOption === "z-to-a") {
      sortedProjects.sort((a, b) => b.projectName.localeCompare(a.projectName));
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

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const token = params.get('t');
    setSupplierToken(token);
    if (!token) return;

    (async () => {
      const result = await isSupplierTokenValid(token);
      if (result) setShowLoginPopup(true);
    })();
  }, []);

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
            <button className={`${styles.viewModeButton} ${viewMode === 'active' ? styles.active : ''}`} onClick={() => { setViewMode('active'); setCurrentPage(1); }}>Active</button>
            <button className={`${styles.viewModeButton} ${viewMode === 'archived' ? styles.active : ''}`} onClick={() => { setViewMode('archived'); setCurrentPage(1); }}>Archived</button>
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
          {/* Add Project Button */}
          <button
            className={`${styles.addProjectButton}`}
            onClick={async () => {
              setShowModal(true);
            }}
          >
            <div className={styles.addProjectContainer}>
              <span className={styles.plusSign}>&#43;</span>
              <span className={styles.addProjectLabel}>Add project</span>
            </div>
          </button>
          <button
            className={`${styles.editButton} ${isEditMode ? styles.active : ''}`}
            onClick={async () => {
              if (isEditMode) {
                // Only save projects that were actually edited
                for (const projectId of editedProjectIds) {
                  const edited = editableProjects.find(p => p.id === projectId);
                  const original = originalProjects.find(p => p.id === projectId);

                  if (!edited || !original) continue;

                  const updatedFields: Partial<Project> = {};
                  for (const key in edited) {
                    if (edited[key as keyof Project] !== original[key as keyof Project]) {
                      (updatedFields as any)[key] = (edited as any)[key];
                    }
                  }

                  if (Object.keys(updatedFields).length > 0) {
                    await handleSaveProject(edited.id, updatedFields);
                  }
                }

                setEditableProjects([]);
                setEditedProjectIds(new Set()); // Clear tracked edits
              } else {
                // Going into edit mode
                setEditableProjects(JSON.parse(JSON.stringify(currentProjects)));
                setOriginalProjects(JSON.parse(JSON.stringify(currentProjects)));
                setEditedProjectIds(new Set());
              }

              setIsEditMode(!isEditMode);
            }}
          >
            {isEditMode ? 'Done' : 'Edit Projects'}
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
              headers={['Project', 'Client', 'Supplier', 'Overall Status', 'Analysis stage', 'Spend Category', 'Geography', 'Last Updated', 'Start Date', 'Action']}
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
                  onSave={async (updatedFields) => {
                    if (isEditMode) {
                      // Update local state
                      setEditableProjects(prev =>
                        prev.map(p => p.id === project.id ? { ...p, ...updatedFields } : p)
                      );

                      // Also update the original to mark as "saved"
                      setOriginalProjects(prev =>
                        prev.map(p => p.id === project.id ? { ...p, ...updatedFields } : p)
                      );

                      // Save immediately to Firebase
                      await handleSaveProject(project.id, updatedFields);
                    } else {
                      handleSaveProject(project.id, updatedFields);
                    }
                  }}


                  onActionClick={handleActionClick}
                  onArchiveClick={handleToggleArchive} activeActionMenuId={activeActionMenu}  // 👈 here
                  onRowClick={() => {
                    navigate(`/dashboard/admin/projects/${project.projectName.toLowerCase()}`, { state: { project } });
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
        {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} supplierToken={supplierToken ?? ''} />}
        {showModal && <ProjectModal onClose={() => setShowModal(false)} projects={projects} />}
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
