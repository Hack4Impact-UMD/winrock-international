import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import WinrockDashboard from './dashboards/winrock-dashboard/projects/winrockDashboard';
import NotificationCenter from './dashboards/winrock-dashboard/notification-center/NotificationCenter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                           element={<WinrockDashboard />} />
        <Route path="/projects"                   element={<WinrockDashboard />} />
        <Route path="/notification-center"        element={<NotificationCenter />} />
        <Route path="/account-settings"           element={<></>} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;