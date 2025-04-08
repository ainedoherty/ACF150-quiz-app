import React, { useState } from 'react';
import './styles/Style.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import SetupSection from './components/SetupSection';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Stats from './components/Stats';
import ConfirmationModal from './components/ConfirmationModal';
import { Question } from './types';
import { parseCSV, getPresetQuiz } from './utils/quizHelpers';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [csvData, setCsvData] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string>('');
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalQuestions: number;
    bestStreak: number;
    incorrectQuestions: number[];
    topicScores: Record<string, { correct: number; total: number }>;
    quizId?: string;
  } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'home') {
      setCurrentSection('home');
    } else if (tab === 'quiz' && questions.length > 0) {
      setCurrentSection('quiz');
    } else if (tab === 'stats') {
      setCurrentSection('stats');
    }
  };

  // Handle starting a preset quiz
  const handleStartPresetQuiz = (preset: string) => {
    const presetQuestions = getPresetQuiz(preset);
    setQuestions(presetQuestions);
    setCurrentQuizId(preset);
    setCurrentSection('quiz');
    setActiveTab('quiz');
  };

  // Handle "Create Your Own Quiz" button
  const handleCreateOwn = () => {
    setCurrentSection('setup');
  };

  // Handle CSV input change
  const handleCsvInputChange = (csv: string) => {
    setCsvData(csv);
  };

  // Handle start quiz button from setup section
  const handleStartCustomQuiz = () => {
    try {
      const parsedQuestions = parseCSV(csvData);
      setQuestions(parsedQuestions);
      setCurrentQuizId('custom-quiz');
      setCurrentSection('quiz');
      setActiveTab('quiz');
    } catch (error) {
      alert('Error parsing CSV data: ' + (error as Error).message);
    }
  };

  // Handle back to home button
  const handleBackToHome = () => {
    setCurrentSection('home');
    setActiveTab('home');
  };

  // Handle quiz completion
  const handleQuizComplete = (results: {
    score: number;
    totalQuestions: number;
    bestStreak: number;
    incorrectQuestions: number[];
    topicScores: Record<string, { correct: number; total: number }>;
  }) => {
    setQuizResults(results);
    setCurrentSection('results');
    setActiveTab('quiz');
  };

  // Handle opening the reset confirmation modal
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  // Handle confirming the reset
  const handleConfirmReset = () => {
    // Clear all localStorage data
    localStorage.removeItem('quizResults');
    localStorage.removeItem('cumulativeTopicScores');
    
    // Reset state
    setQuizResults(null);
    setQuestions([]);
    setCurrentSection('home');
    setActiveTab('home');
    
    
    // Close modal
    setIsResetModalOpen(false);
    
    // Show success message
    setTimeout(() => {
      alert('🎉 All quiz data has been reset! Starting fresh!');
    }, 300);
    window.location.reload();
  };

  // Handle cancelling the reset
  const handleCancelReset = () => {
    setIsResetModalOpen(false);
    
    // Show cancelled message
    setTimeout(() => {
      alert('😌 Phew! Your quiz data is safe.');
    }, 300);
  };

  // Render appropriate content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return (
          <HomePage 
            onStartQuiz={handleStartPresetQuiz} 
            onCreateOwn={handleCreateOwn} 
          />
        );
      case 'setup':
        return (
          <SetupSection 
            onStartQuiz={handleStartCustomQuiz} 
            onBackToHome={handleBackToHome} 
            onCsvInputChange={handleCsvInputChange} 
          />
        );
      case 'quiz':
        return (
          <Quiz 
            questions={questions}
            quizId={currentQuizId}
            onQuizComplete={handleQuizComplete} 
          />
        );
      case 'results':
        return quizResults ? (
          <Results 
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions}
            bestStreak={quizResults.bestStreak}
            incorrectQuestions={quizResults.incorrectQuestions}
            topicScores={quizResults.topicScores}
            questions={questions}
            onRestartQuiz={handleBackToHome}
          />
        ) : null;
      case 'stats':
        return <Stats onBackToHome={handleBackToHome} />;
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="quiz-app">
          <Header 
            title="ACF150 MCQ Final Boss" 
            subtitle="Test your knowledge of all things topics 6-10" 
          />
          
          {(currentSection !== 'home' && currentSection !== 'setup') && (
            <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
          )}
          
          {renderContent()}
          
          <div 
            id="sneaky-reset" 
            className="sneaky-reset" 
            style={{fontSize: '6px', padding: '2px 4px', bottom: '3px', left: '3px'}} 
            onClick={handleOpenResetModal}
          >
            DO NOT PRESS
          </div>
          
          <ConfirmationModal 
            isOpen={isResetModalOpen}
            message="Are you absolutely, positively sure you want to erase all your quiz progress? This will delete all your scores and statistics forever!"
            onConfirm={handleConfirmReset}
            onCancel={handleCancelReset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
