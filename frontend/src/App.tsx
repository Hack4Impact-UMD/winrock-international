import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from './auth/pages/SignupPage';
import WinrockDashboard from './dashboards/winrock-dashboard/winrockDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/dashboard" element={<WinrockDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
