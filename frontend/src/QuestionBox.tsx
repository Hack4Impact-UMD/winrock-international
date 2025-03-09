import React from "react";
import "./QuestionBox.css";

interface QuestionBoxProps {
  prompt: string;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ prompt }) => {
  return (
    <div className="question-box">
      <h2 className="question-title">Climate Change Adaptation</h2>
      <p className="prompt">{prompt}</p>
      <select className="dropdown">
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="partial">Partially</option>
      </select>
      <p className="justify">
        Please justify your answer, including if a mitigation plan is in place.
      </p>
      <textarea placeholder="Type here" className="textbox" />
    </div>
  );
};

export default QuestionBox;
