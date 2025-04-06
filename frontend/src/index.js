import React from 'react';
import ReactDOM from 'react-dom/client'; // <- this is the key change
import App from './App.tsx';
import './index.css'; // optional

const root = ReactDOM.createRoot(document.getElementById('root')); // this is the new React 18 API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
