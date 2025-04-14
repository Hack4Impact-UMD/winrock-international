import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage   from './auth/pages/LoginPage';
import ForgotPasswordPage from './auth/pages/ForgotPasswordPage';
import SignupPage from './auth/pages/SignupPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup"                     element={<SignupPage />} />
        <Route path="/"                           element={<LoginPage />} />
        <Route path="/forgot-password"            element={<ForgotPasswordPage />} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
  
}