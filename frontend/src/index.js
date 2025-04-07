// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';   // ← correct import for React 18+
import App from './App.tsx';
import './index.css';                      // your global styles

const container = document.getElementById('root');
if (!container) throw new Error("Root container missing in index.html");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
