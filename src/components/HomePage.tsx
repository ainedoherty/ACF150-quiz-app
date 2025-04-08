import React, { useEffect, useState } from 'react';

interface HomePageProps {
  onStartQuiz: (preset: string) => void;
  onCreateOwn: () => void;
}

interface QuizMetadata {
  id: string;
  title: string;
  questions: number;
  difficulty: string;
}

interface CompletionCount {
  [quizId: string]: number;
}

const HomePage: React.FC<HomePageProps> = ({ onStartQuiz, onCreateOwn }) => {
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [completionCounts, setCompletionCounts] = useState<CompletionCount>({});
  
  // Quiz metadata
  const quizzes: QuizMetadata[] = [
    {
      id: "quiz-1",
      title: "Quiz 1",
      questions: 40,
      difficulty: "Warm-Up Round"
    },
    {
      id: "quiz-2",
      title: "Quiz 2",
      questions: 40,
      difficulty: "MCQ Sprint"
    },
    {
      id: "quiz-3",
      title: "Quiz 3",
      questions: 40,
      difficulty: "Knowledge Knockout"
    },
    {
      id: "quiz-4",
      title: "Quiz 4",
      questions: 40,
      difficulty: "Fact Frenzy"
    },
    {
      id: "quiz-5",
      title: "Quiz 5",
      questions: 40,
      difficulty: "Midway Mastery"
    },
    {
      id: "quiz-6",
      title: "Quiz 6",
      questions: 40,
      difficulty: "Quiz Conqueror"
    },
    {
      id: "quiz-7",
      title: "Quiz 7",
      questions: 40,
      difficulty: "ACF150 Blitz"
    },
    {
      id: "quiz-8",
      title: "Quiz 8",
      questions: 40,
      difficulty: "Precision Quest"
    },
    {
      id: "quiz-9",
      title: "Quiz 9",
      questions: 40,
      difficulty: "Brain Boost"
    },
    {
      id: "quiz-10",
      title: "Quiz 10",
      questions: 40,
      difficulty: "The Final Frontier"
    }
  ];
  
  // Load completed quizzes from localStorage
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('quizResults');
      if (storedResults) {
        const quizResults = JSON.parse(storedResults);
        const completedIds = new Set<string>();
        const counts: CompletionCount = {};
        
        quizResults.forEach((result: any) => {
          if (result && result.quizId) {
            completedIds.add(result.quizId);
            counts[result.quizId] = (counts[result.quizId] || 0) + 1;
          }
        });
        
        setCompletedQuizzes(Array.from(completedIds));
        setCompletionCounts(counts);
      }
    } catch (error) {
      console.error('Error loading completed quizzes:', error);
    }
  }, []);
  
  // Format completion message
  const getCompletionText = (quizId: string) => {
    const count = completionCounts[quizId] || 0;
    if (count === 0) return "Not yet";
    if (count === 1) return "1 time";
    return `${count} times`;
  };
  
  return (
    <div id="home-section" className="section">
      <div className="welcome-message">
        <h2>Welcome to ACF150 MCQ Quiz</h2>
        <p>Test your knowledge with our interactive quizzes. Track your progress and identify areas for improvement.</p>
      </div>
      
      <h2>Choose a Preset Quiz</h2>
      <div className="preset-quizzes">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-card-header">
              {quiz.title} {completedQuizzes.includes(quiz.id) && <span className="completed-badge">✓</span>}
            </div>
            <div className="quiz-card-body">
              <div className="quiz-card-stat">
                <div className="quiz-card-stat-label">Questions</div>
                <div className="quiz-card-stat-value">{quiz.questions}</div>
              </div>
              <div className="quiz-card-stat">
                <div className="quiz-card-stat-label">Difficulty</div>
                <div className="quiz-card-stat-value">{quiz.difficulty}</div>
              </div>
              {Object.keys(completionCounts).length > 0 && (
                <div className="quiz-card-stat">
                  <div className="quiz-card-stat-label">Completed</div>
                  <div className={`quiz-card-stat-value ${completedQuizzes.includes(quiz.id) ? 'completed-count' : 'not-completed'}`}>
                    {getCompletionText(quiz.id)}
                  </div>
                </div>
              )}
            </div>
            <div className="quiz-card-footer">
              <button 
                className="btn start-preset-btn" 
                onClick={() => onStartQuiz(quiz.id)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="divider"><div className="divider-text">OR</div></div>
      <div style={{ textAlign: 'center' }}>
        <button id="create-own-btn" className="btn btn-info" onClick={onCreateOwn}>Create Your Own Quiz</button>
      </div>
    </div>
  );
};

export default HomePage; 