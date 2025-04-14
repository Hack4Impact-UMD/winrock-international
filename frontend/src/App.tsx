import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Renewable from './components/Renewable'; // Your first page component
import Page2 from './components/Page2'; // The new page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Renewable />} /> {/* Page 1 */}
        <Route path="/page2" element={<Page2 />} /> {/* Page 2 */}
      </Routes>
    </Router>
  );
};

export default App;
