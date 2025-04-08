import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizProps {
  questions: Question[];
  quizId?: string;
  onQuizComplete: (results: {
    score: number;
    totalQuestions: number;
    bestStreak: number;
    incorrectQuestions: any[];
    topicScores: Record<string, any>;
    quizId?: string;
  }) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, quizId, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);
  const [topicScores, setTopicScores] = useState<Record<string, any>>({});
  const [feedbackClass, setFeedbackClass] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Function to handle option selection
  const handleOptionSelect = (index: number) => {
    if (!answerChecked) {
      setSelectedOptionIndex(index);
    }
  };

  // Function to check answer
  const checkAnswer = () => {
    if (selectedOptionIndex === null) return;
    
    const isCorrect = questions[currentQuestionIndex].correctAnswer === 
                       questions[currentQuestionIndex].options[selectedOptionIndex];
    
    // Update score and streak
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setPoints(points + 10 * (streak + 1));
      setFeedbackClass('correct');
      setFeedbackMessage('Correct! Well done.');
    } else {
      // Record incorrect question
      setIncorrectQuestions([...incorrectQuestions, currentQuestionIndex]);
      setStreak(0);
      setFeedbackClass('incorrect');
      setFeedbackMessage(`Incorrect. The correct answer is ${questions[currentQuestionIndex].correctAnswer}.`);
    }
    
    // Update best streak
    if (streak + 1 > bestStreak && isCorrect) {
      setBestStreak(streak + 1);
    }
    
    // Track performance by topic
    const topic = questions[currentQuestionIndex].topic || 'Unknown';
    const topicData = topicScores[topic] || { correct: 0, total: 0 };
    setTopicScores({
      ...topicScores,
      [topic]: {
        correct: isCorrect ? topicData.correct + 1 : topicData.correct,
        total: topicData.total + 1
      }
    });
    
    setAnswerChecked(true);
    setFeedbackVisible(true);
  };

  // Function to move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setAnswerChecked(false);
      setFeedbackVisible(false);
    } else {
      // Quiz completed
      const results = {
        score,
        totalQuestions: questions.length,
        bestStreak,
        incorrectQuestions,
        topicScores,
        quizId,
        timestamp: new Date().toISOString()
      };
      
      // Save results to localStorage
      try {
        const storedResults = localStorage.getItem('quizResults');
        const quizResults = storedResults ? JSON.parse(storedResults) : [];
        quizResults.push(results);
        localStorage.setItem('quizResults', JSON.stringify(quizResults));
      } catch (error) {
        console.error('Failed to save quiz results:', error);
      }
      
      onQuizComplete(results);
    }
  };

  return (
    <div id="quiz-section" className="section">
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-icon">💖</div>
          <div id="points-display" className="stat-value">{points}</div>
          <div className="stat-label">Points</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🔥</div>
          <div id="streak-display" className="stat-value">{streak}</div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div id="correct-count-display" className="stat-value">{score}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">📚</div>
          <div id="progress-display" className="stat-value">{currentQuestionIndex + 1}/{questions.length}</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="progress-container">
        <div 
          id="progress-bar" 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div id="question-card" className="card">
        <div id="question-text" className="question">
          {currentQuestion?.question}
        </div>
        <div id="options-container" className="options">
          {currentQuestion?.options.map((option, index) => (
            <div 
              key={index} 
              className={`option ${selectedOptionIndex === index ? 'selected' : ''} 
                          ${answerChecked && index === selectedOptionIndex && option === currentQuestion.correctAnswer ? 'correct' : ''} 
                          ${answerChecked && index === selectedOptionIndex && option !== currentQuestion.correctAnswer ? 'incorrect' : ''}`} 
              onClick={() => handleOptionSelect(index)}
            >
              <div className="option-label">{String.fromCharCode(65 + index)}</div>
              <div className="option-text">{option}</div>
            </div>
          ))}
        </div>
        
        {feedbackVisible && (
          <div id="feedback" className={`feedback ${feedbackClass}`}>
            {feedbackMessage}
          </div>
        )}
        
        <div className="controls">
          {!answerChecked ? (
            <button 
              id="submit-btn" 
              className="btn" 
              onClick={checkAnswer} 
              disabled={selectedOptionIndex === null}
            >
              Submit
            </button>
          ) : (
            <button 
              id="next-btn" 
              className="btn" 
              onClick={nextQuestion}
            >
              {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 