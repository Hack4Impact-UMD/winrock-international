// src/App.tsx
import React, { useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import ReactDOM from 'react-dom/client';     // ← import ReactDOM here

import WelcomePage from './pages/WelcomePage';
import LoginPage   from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ResetPasswordPage   from './pages/ResetPasswordPage';
import PasswordChangedPage from './pages/PasswordChangedPage';

// import { handleClientSignup, handleClientLogin } from "./auth/clientAuth";
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return result;
}

function generateRandomEmail() {
  return generateRandomString(10) + "@" + generateRandomString(5) + ".com";
}

function generateRandomPassword() {
  return generateRandomString(15);
}

export default function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserPassword, setCurrentUserPassword] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                           element={<WelcomePage />} />
        <Route path="/signup"                     element={<SignUpPage />} />
        <Route path="/login"                      element={<LoginPage />} />
        <Route path="/forgot-password"            element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/verify"     element={<OTPVerificationPage />} />
        <Route path="/forgot-password/reset"      element={<ResetPasswordPage />} />
        <Route path="/forgot-password/success"    element={<PasswordChangedPage />} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
    

      {/* --- Your test signup/login UI (always visible) --- */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: "1.5rem", fontSize: "2rem" }}>
          Test Client Signup/Login
        </p>
        <button
          onClick={async () => {
            const newUserEmail = generateRandomEmail();
            const newUserPassword = generateRandomPassword();
            setCurrentUserEmail(newUserEmail);
            setCurrentUserPassword(newUserPassword);
            // await handleClientSignup({ email: newUserEmail, password: newUserPassword });
          }}
          style={{
            margin: "1rem",
            padding: "1rem 2rem",
            borderRadius: "15px",
            background: "blue",
            color: "white",
            fontSize: "1rem",
            fontFamily: "sans-serif",
            cursor: "pointer"
          }}
        >
          Create User w/ Random Email and Password
        </button>
        <button
          onClick={async () => {
            // await handleClientLogin({ email: currentUserEmail, password: currentUserPassword });
          }}
          style={{
            margin: "1rem",
            padding: "1rem 2rem",
            borderRadius: "15px",
            background: "white",
            color: "black",
            fontSize: "1rem",
            fontFamily: "sans-serif",
            cursor: "pointer"
          }}
        >
          Log In User (Click After Creating User)
        </button>
      </div>
    </BrowserRouter>
  );
  
}


