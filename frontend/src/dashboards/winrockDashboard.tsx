import React, { useState } from 'react';
import styles from '../css-modules/WinrockDashboard.module.css';
import winrockLogo from '../assets/winrock-international-logo.png';
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.73301 1.33325H3.66634C3.36101 1.33325 3.09834 1.33325 2.86634 1.38792C2.50719 1.47374 2.17881 1.65731 1.91758 1.9183C1.65636 2.1793 1.47248 2.50751 1.38634 2.86659C1.33301 3.09859 1.33301 3.35992 1.33301 3.66659V6.99992C1.33301 7.30525 1.33301 7.56792 1.38767 7.79992C1.47349 8.15907 1.65707 8.48745 1.91806 8.74868C2.17905 9.0099 2.50727 9.19378 2.86634 9.27992C3.09834 9.33325 3.35967 9.33325 3.66634 9.33325H6.99967C7.30501 9.33325 7.56767 9.33325 7.79967 9.27859C8.15883 9.19277 8.48721 9.00919 8.74843 8.7482C9.00966 8.48721 9.19353 8.15899 9.27967 7.79992C9.33301 7.56792 9.33301 7.30659 9.33301 6.99992V3.66659C9.33301 3.36125 9.33301 3.09859 9.27834 2.86659C9.19252 2.50743 9.00895 2.17905 8.74795 1.91783C8.48696 1.6566 8.15875 1.47273 7.79967 1.38659C7.56767 1.33325 7.30634 1.33325 6.99967 1.33325H3.73301ZM3.17701 2.68525C3.23434 2.67192 3.32367 2.66659 3.73301 2.66659H6.93301C7.34367 2.66659 7.43167 2.67059 7.48901 2.68525C7.60878 2.71389 7.71828 2.77515 7.80536 2.86223C7.89244 2.94931 7.9537 3.05881 7.98234 3.17859C7.99567 3.23459 7.99967 3.32259 7.99967 3.73325V6.93325C7.99967 7.34392 7.99567 7.43192 7.98101 7.48925C7.95237 7.60903 7.89111 7.71852 7.80403 7.8056C7.71695 7.89268 7.60745 7.95394 7.48767 7.98259C7.43301 7.99459 7.34501 7.99992 6.93301 7.99992H3.73301C3.32234 7.99992 3.23434 7.99592 3.17701 7.98125C3.05723 7.95261 2.94774 7.89135 2.86066 7.80427C2.77357 7.71719 2.71232 7.60769 2.68367 7.48792C2.67167 7.43325 2.66634 7.34525 2.66634 6.93325V3.73325C2.66634 3.32259 2.67034 3.23459 2.68501 3.17725C2.71365 3.05748 2.77491 2.94798 2.86199 2.8609C2.94907 2.77382 3.05857 2.71256 3.17834 2.68392M13.0663 1.33325H12.9997C12.6943 1.33325 12.4317 1.33325 12.1997 1.38792C11.8405 1.47374 11.5121 1.65731 11.2509 1.9183C10.9897 2.1793 10.8058 2.50751 10.7197 2.86659C10.6663 3.09859 10.6663 3.35992 10.6663 3.66659V6.99992C10.6663 7.30525 10.6663 7.56792 10.721 7.79992C10.8068 8.15907 10.9904 8.48745 11.2514 8.74868C11.5124 9.0099 11.8406 9.19378 12.1997 9.27992C12.4317 9.33325 12.693 9.33325 12.9997 9.33325H16.333C16.6383 9.33325 16.901 9.33325 17.133 9.27859C17.4922 9.19277 17.8205 9.00919 18.0818 8.7482C18.343 8.48721 18.5269 8.15899 18.613 7.79992C18.6663 7.56792 18.6663 7.30659 18.6663 6.99992V3.66659C18.6663 3.36125 18.6663 3.09859 18.6117 2.86659C18.5259 2.50743 18.3423 2.17905 18.0813 1.91783C17.8203 1.6566 17.4921 1.47273 17.133 1.38659C16.901 1.33325 16.6397 1.33325 16.333 1.33325H13.0663ZM12.5103 2.68525C12.5677 2.67192 12.657 2.66659 13.0663 2.66659H16.2663C16.677 2.66659 16.765 2.67059 16.8223 2.68525C16.9421 2.71389 17.0516 2.77515 17.1387 2.86223C17.2258 2.94931 17.287 3.05881 17.3157 3.17859C17.329 3.23459 17.333 3.32259 17.333 3.73325V6.93325C17.333 7.34392 17.3277 7.43192 17.3143 7.48925C17.2857 7.60903 17.2244 7.71852 17.1374 7.8056C17.0503 7.89268 16.9408 7.95394 16.821 7.98259C16.765 7.99592 16.677 7.99992 16.2663 7.99992H13.0663C12.6557 7.99992 12.5677 7.99592 12.5103 7.98125C12.3906 7.95261 12.2811 7.89135 12.194 7.80427C12.1069 7.71719 12.0456 7.60769 12.017 7.48792C12.005 7.43325 11.9997 7.34525 11.9997 6.93325V3.73325C11.9997 3.32259 12.0037 3.23459 12.0183 3.17725C12.047 3.05748 12.1082 2.94798 12.1953 2.8609C12.2824 2.77382 12.3919 2.71256 12.5117 2.68392M3.66634 10.6666H6.99967C7.30501 10.6666 7.56767 10.6666 7.79967 10.7213C8.15883 10.8071 8.48721 10.9906 8.74843 11.2516C9.00966 11.5126 9.19353 11.8408 9.27967 12.1999C9.33301 12.4319 9.33301 12.6933 9.33301 12.9999V16.3333C9.33301 16.6386 9.33301 16.9013 9.27834 17.1333C9.19252 17.4924 9.00895 17.8208 8.74795 18.082C8.48696 18.3432 8.15875 18.5271 7.79967 18.6133C7.56767 18.6666 7.30634 18.6666 6.99967 18.6666H3.66634C3.36101 18.6666 3.09834 18.6666 2.86634 18.6119C2.50719 18.5261 2.17881 18.3425 1.91758 18.0815C1.65636 17.8205 1.47248 17.4923 1.38634 17.1333C1.33301 16.9013 1.33301 16.6399 1.33301 16.3333V12.9999C1.33301 12.6946 1.33301 12.4319 1.38767 12.1999C1.47349 11.8408 1.65707 11.5124 1.91806 11.2512C2.17905 10.9899 2.50727 10.8061 2.86634 10.7199C3.09834 10.6666 3.35967 10.6666 3.66634 10.6666ZM3.73301 11.9999C3.32234 11.9999 3.23434 12.0039 3.17701 12.0186C3.05723 12.0472 2.94774 12.1085 2.86066 12.1956C2.77357 12.2826 2.71232 12.3921 2.68367 12.5119C2.67167 12.5666 2.66634 12.6546 2.66634 13.0666V16.2666C2.66634 16.6773 2.67034 16.7653 2.68501 16.8226C2.71365 16.9424 2.77491 17.0519 2.86199 17.1389C2.94907 17.226 3.05857 17.2873 3.17834 17.3159C3.23434 17.3293 3.32234 17.3333 3.73301 17.3333H6.93301C7.34367 17.3333 7.43167 17.3279 7.48901 17.3146C7.60878 17.2859 7.71828 17.2247 7.80536 17.1376C7.89244 17.0505 7.9537 16.941 7.98234 16.8213C7.99567 16.7653 7.99967 16.6773 7.99967 16.2666V13.0666C7.99967 12.6559 7.99567 12.5679 7.98101 12.5106C7.95237 12.3908 7.89111 12.2813 7.80403 12.1942C7.71695 12.1072 7.60745 12.0459 7.48767 12.0173C7.43301 12.0053 7.34501 11.9999 6.93301 11.9999H3.73301ZM13.0663 10.6666H12.9997C12.6943 10.6666 12.4317 10.6666 12.1997 10.7213C11.8405 10.8071 11.5121 10.9906 11.2509 11.2516C10.9897 11.5126 10.8058 11.8408 10.7197 12.1999C10.6663 12.4319 10.6663 12.6933 10.6663 12.9999V16.3333C10.6663 16.6386 10.6663 16.9013 10.721 17.1333C10.8068 17.4924 10.9904 17.8208 11.2514 18.082C11.5124 18.3432 11.8406 18.5271 12.1997 18.6133C12.4317 18.6679 12.6943 18.6679 12.9997 18.6679H16.333C16.6383 18.6679 16.901 18.6679 17.133 18.6133C17.4919 18.5272 17.82 18.3435 18.081 18.0826C18.342 17.8216 18.5256 17.4935 18.6117 17.1346C18.6663 16.9026 18.6663 16.6399 18.6663 16.3346V13.0013C18.6663 12.6959 18.6663 12.4333 18.6117 12.2013C18.5261 11.8419 18.3426 11.5132 18.0816 11.2517C17.8206 10.9902 17.4923 10.8062 17.133 10.7199C16.901 10.6666 16.6397 10.6666 16.333 10.6666H13.0663ZM12.5103 12.0186C12.5677 12.0053 12.657 11.9999 13.0663 11.9999H16.2663C16.677 11.9999 16.765 12.0039 16.8223 12.0186C16.9421 12.0472 17.0516 12.1085 17.1387 12.1956C17.2258 12.2826 17.287 12.3921 17.3157 12.5119C17.329 12.5679 17.333 12.6559 17.333 13.0666V16.2666C17.333 16.6773 17.3277 16.7653 17.3143 16.8226C17.2857 16.9424 17.2244 17.0519 17.1374 17.1389C17.0503 17.226 16.9408 17.2873 16.821 17.3159C16.765 17.3293 16.677 17.3333 16.2663 17.3333H13.0663C12.6557 17.3333 12.5677 17.3279 12.5103 17.3146C12.3906 17.2859 12.2811 17.2247 12.194 17.1376C12.1069 17.0505 12.0456 16.941 12.017 16.8213C12.005 16.7666 11.9997 16.6786 11.9997 16.2666V13.0666C11.9997 12.6559 12.0037 12.5679 12.0183 12.5106C12.047 12.3908 12.1082 12.2813 12.1953 12.1942C12.2824 12.1072 12.3919 12.0459 12.5117 12.0173" fill="#005293"/>
            </svg>
            Projects
          </button>
          <button 
            className={`${styles.sideButton} ${activeSideButton === 'Notification Center' ? styles.active : ''}`}
            onClick={() => setActiveSideButton('Notification Center')}
          >
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.08333 14.375H7.91667C7.91667 15.1542 7.27917 15.7917 6.5 15.7917C5.72083 15.7917 5.08333 15.1542 5.08333 14.375ZM12.875 12.9583V13.6667H0.125V12.9583L1.54167 11.5417V7.29167C1.54167 5.09583 2.95833 3.18333 5.08333 2.54583V2.33333C5.08333 1.55417 5.72083 0.916666 6.5 0.916666C7.27917 0.916666 7.91667 1.55417 7.91667 2.33333V2.54583C10.0417 3.18333 11.4583 5.09583 11.4583 7.29167V11.5417L12.875 12.9583ZM10.0417 7.29167C10.0417 5.30833 8.48333 3.75 6.5 3.75C4.51667 3.75 2.95833 5.30833 2.95833 7.29167V12.25H10.0417V7.29167Z" fill="#005293"/>
            </svg>
            Notification Center
          </button>
          <button 
            className={`${styles.sideButton} ${activeSideButton === 'Account Settings' ? styles.active : ''}`}
            onClick={() => setActiveSideButton('Account Settings')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.67807 17.3334L6.34639 14.6667C6.16674 14.5973 5.99758 14.514 5.83893 14.4167C5.68028 14.3195 5.52467 14.2154 5.3721 14.1042L2.90527 15.1459L0.625 11.1876L2.76016 9.56258C2.74634 9.46536 2.73943 9.37175 2.73943 9.28175V8.71925C2.73943 8.62869 2.74634 8.5348 2.76016 8.43758L0.625 6.81258L2.90527 2.85425L5.3721 3.89591C5.52412 3.7848 5.68304 3.68064 5.84888 3.58341C6.01472 3.48619 6.18056 3.40286 6.34639 3.33341L6.67807 0.666748H11.2386L11.5703 3.33341C11.7499 3.40286 11.9194 3.48619 12.0786 3.58341C12.2378 3.68064 12.3931 3.7848 12.5446 3.89591L15.0114 2.85425L17.2917 6.81258L15.1565 8.43758C15.1703 8.5348 15.1772 8.62869 15.1772 8.71925V9.28091C15.1772 9.37147 15.1634 9.46536 15.1358 9.56258L17.2709 11.1876L14.9907 15.1459L12.5446 14.1042C12.3926 14.2154 12.2336 14.3195 12.0678 14.4167C11.9019 14.514 11.7361 14.5973 11.5703 14.6667L11.2386 17.3334H6.67807ZM8.99979 11.9167C9.80134 11.9167 10.4854 11.632 11.052 11.0626C11.6186 10.4931 11.9019 9.80564 11.9019 9.00008C11.9019 8.19453 11.6186 7.50703 11.052 6.93758C10.4854 6.36814 9.80134 6.08341 8.99979 6.08341C8.18443 6.08341 7.49675 6.36814 6.93678 6.93758C6.3768 7.50703 6.09708 8.19453 6.09764 9.00008C6.09819 9.80564 6.37818 10.4931 6.9376 11.0626C7.49703 11.632 8.18443 11.9167 8.99979 11.9167Z" fill="#005293"/>
            </svg>
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