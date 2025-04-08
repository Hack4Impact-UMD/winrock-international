import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import AuthEntryPage from './auth/pages/AuthEntryPage';
import LoginPage   from './auth/pages/LoginPage';
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage';
import SignUpPage from './auth/pages/SignUpPage';
import OTPVerificationPage from './auth/pages/OTPVerificationPage';
import ResetPasswordPage   from './auth/pages/ResetPasswordPage';
import PasswordChangedPage from './auth/pages/PasswordChangedPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                           element={<AuthEntryPage />} />
        <Route path="/signup"                     element={<SignUpPage />} />
        <Route path="/login"                      element={<LoginPage />} />
        <Route path="/forgot-password"            element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/verify"     element={<OTPVerificationPage />} />
        <Route path="/forgot-password/reset"      element={<ResetPasswordPage />} />
        <Route path="/forgot-password/success"    element={<PasswordChangedPage />} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
  
}


