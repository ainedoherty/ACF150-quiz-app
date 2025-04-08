import React from 'react';

interface SetupSectionProps {
  onStartQuiz: () => void;
  onBackToHome: () => void;
  onCsvInputChange: (csv: string) => void;
}

const SetupSection: React.FC<SetupSectionProps> = ({ 
  onStartQuiz, 
  onBackToHome, 
  onCsvInputChange 
}) => {
  return (
    <div id="setup-section" className="section">
      <h2>Setup Your Quiz</h2>
      <p>Paste your questions in CSV format</p>
      <div className="format-example">Format: Question,Option A,Option B,Option C,Option D,Correct Answer,Topic</div>
      <textarea 
        id="csv-input" 
        placeholder="Paste your CSV data here..."
        onChange={(e) => onCsvInputChange(e.target.value)}
      ></textarea>
      <div className="btn-group">
        <button id="start-btn" className="btn" onClick={onStartQuiz}>Start Quiz</button>
        <button id="back-to-home-btn" className="btn btn-secondary" onClick={onBackToHome}>Back to Home</button>
      </div>
    </div>
  );
};

export default SetupSection; 