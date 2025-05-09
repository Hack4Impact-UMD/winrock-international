import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './auth/pages/LoginPage';
import SignupPage from './auth/pages/SignupPage';
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage';
import AgricultureProposalForm from './forms/project-proposal-forms/AgricultureProposalForm';
import RenewableProposalForm from './forms/project-proposal-forms/RenewableProposalForm';
import ForestryRisksForm from './forms/risks-and-co-benefit-forms/ForestryRisksForm';
import TechEnergyRisksForm from './forms/risks-and-co-benefit-forms/TechEnergyRisksForm';
import WinrockDashboard from './dashboards/winrock-dashboard/projects/winrockDashboard';
import NotificationCenter from './dashboards/winrock-dashboard/notification-center/NotificationCenter';
import PasswordChangedPage from './auth/pages/PasswordChangedPage';
import CreateNewPasswordPage from './auth/pages/CreateNewPasswordPage';
import ProjectViewWrapper from './dashboards/project-view/ProjectViewWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/create-new-password" element={<CreateNewPasswordPage />} />
        <Route path="/auth/password-changed" element={<PasswordChangedPage />} />

        <Route path="/forms/agriculture-proposal-form" element={<AgricultureProposalForm />} />
        <Route path="/forms/renewable-proposal-form" element={<RenewableProposalForm />} />
        <Route path="/forms/forestry-risks-form" element={<ForestryRisksForm />} />
        <Route path="/forms/tech-energy-risks-form" element={<TechEnergyRisksForm />} />

        <Route path="/dashboard/admin/projects" element={<WinrockDashboard />} />
        <Route path="/dashboard/admin/projects/:projectId" element={<ProjectViewWrapper />} />
        <Route path="/dashboard/admin/notification-center" element={<NotificationCenter />} />
        <Route path="/dashboard/admin/account-settings" element={<WinrockDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;