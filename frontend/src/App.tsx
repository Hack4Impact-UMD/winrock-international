import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './auth/pages/SignupPage';
import WinrockDashboard from './dashboards/winrock-dashboard/winrockDashboard';
import ProjectTracker from './dashboards/project-view/components/ProjectTracker';
import ProjectViewHeader from "./dashboards/project-view/components/ProjectViewHeader";
import ProjectUpdates from './dashboards/project-view/components/ProjectUpdates';
import { UpdateItem } from './types/UpdateItem';


/*
interface UpdateItem {
  id: number;
  title: string;
  description?: string;
  timestamp: string;
  status: "received" | "sent" | "completed";
  canRequestInfo?: boolean;
}

*/
const updatesData: UpdateItem[] = [
  {
    id: 4,
    title: "Project proposal received",
    timestamp: '1 day ago',
    status: 'received',
    canRequestInfo: true,
  },
  {
    id: 3,
    title: 'Project proposal sent to client for review',
    description: 'Awaiting approval from client',
    timestamp: '5 days ago',
    status: 'sent',
  },
  {
    id: 2,
    title: 'Project proposal looked at by client',
    description: 'View file',
    timestamp: '7 days ago',
    status: 'completed',
  },
  {
    id: 1,
    title: 'Project proposal completed by supplier',
    description: 'View file',
    timestamp: '10 days ago',
    status: 'completed',
  },
];


function App() {
  return (
    <> {/* Use a React.Fragment as the parent element */}
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/dashboard" element={<WinrockDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>

      
      {/* <ProjectViewHeader data={{
        id: 0,
        project: 'USAID Hamro Samman II',
        supplier: 'Cargil',
        overallStatus: 'On Track',
        analysisStage: 'Risk & Co-benefit Assessment',
        spendCategory: 'Cereals & Grains',
        geography: 'North America',
        lastUpdated: '2 days ago',
        startDate: '06/12/2023'
      }} /> */}
      {/* <ProjectTracker currentStage="Clarifying Initial Project Information" initialInfoStatus='completed' technicalStatus='completed' ghgStatus='in-progress' finalStatus='not-started' risksStatus='not-started'></ProjectTracker>
      <ProjectUpdates updates={updatesData}></ProjectUpdates> */}
      {/* <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <ProjectTracker 
          currentStage="Clarifying Initial Project Information" 
          initialInfoStatus='completed' 
          technicalStatus='completed' 
          ghgStatus='in-progress' 
          finalStatus='not-started' 
          risksStatus='not-started' 
        />
        <ProjectUpdates updates={updatesData} />
      </div> */}
      

    </>
  );
}

export default App;