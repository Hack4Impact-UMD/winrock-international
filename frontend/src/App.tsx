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
import ProjectViewWrapper from './dashboards/project-view/projectViewWrapper';
import SupplierDashboard from './dashboards/supplier-view/projects/supplierDashboard';
import SupplierProjectViewWrapper from './dashboards/supplier-project-view/supplierProjectViewWrapper.tsx';
import SupplierNotificationCenter from './dashboards/supplier-view/notification-center/NotificationCenter';
import RegenAgRisksForm from './forms/risks-and-co-benefit-forms/RegenAgRisksForm';
import RequireAuth from './auth/requireAuth.tsx';
import FormBuilder from './forms/FormBuilder.tsx';
import FormDashboard from './forms/FormDashboard.tsx';

function App() {
  return (
    <BrowserRouter basename="/winrock-international">
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/create-new-password" element={<CreateNewPasswordPage />} />
        <Route path="/auth/password-changed" element={<PasswordChangedPage />} />
        <Route path="/form-builder" element={<FormBuilder />} />

        {/* Protected forms */}
        <Route
          path="/forms/agriculture-proposal-form/:projectName"
          element={
            <RequireAuth>
              <AgricultureProposalForm />
            </RequireAuth>
          }
        />
        <Route
          path="/forms/renewable-proposal-form/:projectName"
          element={
            <RequireAuth>
              <RenewableProposalForm />
            </RequireAuth>
          }
        />
        <Route
          path="/forms/forestry-risks-form/:projectName"
          element={
            <RequireAuth>
              <ForestryRisksForm />
            </RequireAuth>
          }
        />
        <Route
          path="/forms/tech-energy-risks-form/:projectName"
          element={
            <RequireAuth>
              <TechEnergyRisksForm />
            </RequireAuth>
          }
        />
        <Route
          path="/forms/regenerative-agriculture-risks-form/:projectName"
          element={
            <RequireAuth>
              <RegenAgRisksForm />
            </RequireAuth>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/dashboard/admin/projects"
          element={
            <RequireAuth>
              <WinrockDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/admin/projects/:projectName"
          element={
            <RequireAuth>
              <ProjectViewWrapper />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/admin/notification-center"
          element={
            <RequireAuth>
              <NotificationCenter />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/admin/account-settings"
          element={
            <RequireAuth>
              <WinrockDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/forms/dashboard"
          element={
            <RequireAuth>
              <FormDashboard />
            </RequireAuth>
          }
        />

        {/* Protected supplier routes */}
        <Route
          path="/dashboard/supplier/projects"
          element={
            <RequireAuth>
              <SupplierDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/supplier/projects/:projectName"
          element={
            <RequireAuth>
              <SupplierProjectViewWrapper />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/supplier/notification-center"
          element={
            <RequireAuth>
              <SupplierNotificationCenter />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/supplier/account-settings"
          element={
            <RequireAuth>
              <SupplierDashboard />
            </RequireAuth>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;