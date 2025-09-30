import React from 'react';
import ReactDOM from 'react-dom/client'; // <- this is the key change
import App from './App';
import './index.css'; // optional

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
