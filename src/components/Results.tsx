import React from 'react';
import { Question } from '../types';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  bestStreak: number;
  incorrectQuestions: number[];
  topicScores: Record<string, { correct: number; total: number }>;
  questions: Question[];
  onRestartQuiz: () => void;
}

const Results: React.FC<ResultsProps> = ({
  score,
  totalQuestions,
  bestStreak,
  incorrectQuestions,
  topicScores,
  questions,
  onRestartQuiz,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div id="results-section" className="results">
      <h2>Quiz Complete!</h2>
      <div className="results-circle">
        <div id="percentage" className="results-percentage">{percentage}%</div>
        <div className="results-text">Accuracy</div>
      </div>
      <div className="results-details">
        <div className="result-stat">
          <div id="final-score" className="result-value">{score}/{totalQuestions}</div>
          <div className="result-label">Score</div>
        </div>
        <div className="result-stat">
          <div id="final-streak" className="result-value">{bestStreak}</div>
          <div className="result-label">Best Streak</div>
        </div>
      </div>
      
      {percentage >= 70 && (
        <div id="achievement" className="achievement">
          <div className="achievement-title">Achievement Unlocked!</div>
          <div id="achievement-text">
            {percentage === 100 
              ? 'Perfect Score! You\'re a quiz master!' 
              : percentage >= 90 
                ? 'Outstanding! Nearly perfect!' 
                : percentage >= 80 
                  ? 'Great job! You\'re well prepared!' 
                  : 'Good work! Keep studying to improve!'}
          </div>
        </div>
      )}
      
      <div id="topic-performance" className="topic-container">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Performance by Topic</h3>
        <div id="topic-stats-container">
          {Object.entries(topicScores).map(([topic, { correct, total }]) => (
            <div key={topic} className="topic-container">
              <div className="topic-header">
                <div className="topic-title">{topic}</div>
                <div className="topic-score">{correct}/{total} ({Math.round((correct/total) * 100)}%)</div>
              </div>
              <div className="topic-progress-bar">
                <div 
                  className="topic-progress" 
                  style={{ width: `${(correct/total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <h3 style={{ margin: '2rem 0 1rem', color: 'var(--primary-color)' }}>Question Review</h3>
      <div id="explanation-container" className="review-section">
        {incorrectQuestions.map(questionIndex => {
          const question = questions[questionIndex];
          return (
            <div key={questionIndex} className="review-card">
              <div className="review-question">{question.question}</div>
              <div className="review-options">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`review-option ${option === question.correctAnswer ? 'correct' : ''}`}
                  >
                    <div className="review-option-label">{String.fromCharCode(65 + index)}</div>
                    {option} {option === question.correctAnswer ? '✓' : ''}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="btn-group">
        <button id="restart-btn" className="btn" onClick={onRestartQuiz}>Return to Home</button>
      </div>
    </div>
  );
};

export default Results; 