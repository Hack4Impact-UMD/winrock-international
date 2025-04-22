import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './auth/pages/SignupPage';
import WinrockDashboard from './dashboards/winrock-dashboard/winrockDashboard';
import ProjectTracker from './dashboards/project-view/components/ProjectTracker';

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
	<ProjectTracker currentStage="Clarifying Initial Project Information" initialInfoStatus='completed' technicalStatus='in-progress' ghgStatus='in-progress' finalStatus='not-started' risksStatus='not-started'></ProjectTracker>
  );
}

export default App;
