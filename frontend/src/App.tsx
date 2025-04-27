import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './auth/pages/SignupPage';
import WinrockDashboard from './dashboards/winrock-dashboard/winrockDashboard';
import ProjectTracker from './dashboards/project-view/components/ProjectTracker';
import ProjectViewHeader from "./dashboards/project-view/components/ProjectViewHeader";

function App() {
  return (
    // <BrowserRouter>
    //   <div className="app-container">
    //     <Routes>
    //       <Route path="/" element={<SignupPage />} />
    //       <Route path="/dashboard" element={<WinrockDashboard />} />
    //     </Routes>
    //   </div>
    // </BrowserRouter>

    <ProjectViewHeader data={{
      id: 0,
      project: 'USAID Hamro Samman II',
      supplier: 'Cargil',
      overallStatus: 'On Track',
      analysisStage: 'Risk & Co-benefit Assessment',
      spendCategory: 'Cereals & Grains',
      geography: 'North America',
      lastUpdated: '2 days ago',
      startDate: '06/12/2023'
    }} />
    //<ProjectTracker currentStage="Clarifying Initial Project Information" initialInfoStatus='completed' technicalStatus='in-progress' ghgStatus='in-progress' finalStatus='not-started' risksStatus='not-started'></ProjectTracker></>
  );
}

export default App;
