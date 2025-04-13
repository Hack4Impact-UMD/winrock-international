import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage   from './auth/pages/LoginPage';
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage';
import SignupPage from './auth/pages/SignupPage';
import ResetPasswordPage   from './auth/pages/ResetPasswordPage';
import PasswordChangedPage from './auth/pages/PasswordChangedPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup"                     element={<SignupPage />} />
        <Route path="/"                           element={<LoginPage />} />
        <Route path="/forgot-password"            element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/reset"      element={<ResetPasswordPage />} />
        <Route path="/forgot-password/success"    element={<PasswordChangedPage />} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
  
}


