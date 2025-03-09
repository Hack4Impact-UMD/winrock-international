import React from "react";
import "./App.css";
import QuestionBox from "./QuestionBox";

function App() {
  return (
    <div className="app-container">
      <QuestionBox 
        prompt="Has the project been designed or the technology type selected to minimize technology risk (operational, failure avoidance, system lifetime, technology maturity)?" 
      />
    </div>
  );
}

export default App;
