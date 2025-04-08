import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsProps {
  onBackToHome: () => void;
}

interface TopicScore {
  total: number;
  correct: number;
}

interface CumulativeScores {
  [topic: string]: TopicScore;
}

const Stats: React.FC<StatsProps> = ({ onBackToHome }) => {
  const [cumulativeTopicScores, setCumulativeTopicScores] = useState<CumulativeScores>({});
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    // Load stats from localStorage or use defaults
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      // Load quiz results for extracting topics and counting quizzes
      const storedResults = localStorage.getItem('quizResults');
      const quizResults = storedResults ? JSON.parse(storedResults) : [];
      setTotalQuizzes(quizResults.length);

      // Extract all unique topics from quiz results
      const topics = new Set<string>();
      let cumulativeScores: CumulativeScores = {};
      
      // Process all quiz results to build cumulative scores
      quizResults.forEach((result: any) => {
        if (result && result.topicScores) {
          Object.keys(result.topicScores).forEach(topic => {
            topics.add(topic);
            
            if (!cumulativeScores[topic]) {
              cumulativeScores[topic] = { total: 0, correct: 0 };
            }
            
            const topicScore = result.topicScores[topic];
            cumulativeScores[topic].total += topicScore.total || 0;
            cumulativeScores[topic].correct += topicScore.correct || 0;
          });
        }
      });
      
      // Update state with the collected data
      setAvailableTopics(Array.from(topics));
      setCumulativeTopicScores(cumulativeScores);
      
      // Calculate total questions and accuracy
      let askedCount = 0;
      let correctCount = 0;
      
      Object.values(cumulativeScores).forEach((score: TopicScore) => {
        askedCount += score.total;
        correctCount += score.correct;
      });
      
      setTotalQuestions(askedCount);
      setAccuracy(askedCount > 0 ? Math.round((correctCount / askedCount) * 100) : 0);
    } catch (error) {
      console.error('Error loading stats:', error);
      setCumulativeTopicScores({});
      setAvailableTopics([]);
    }
  };

  // Format chart data for react-chartjs-2
  const getChartData = () => {
    const topics = Object.keys(cumulativeTopicScores).filter(
      topic => cumulativeTopicScores[topic].total > 0
    );
    
    if (topics.length === 0) {
      return null;
    }
    
    const data = {
      labels: topics,
      datasets: [
        {
          data: topics.map(topic => {
            const { correct, total } = cumulativeTopicScores[topic];
            return total > 0 ? Math.round((correct / total) * 100) : 0;
          }),
          backgroundColor: [
            '#e07a94', '#9f78ce', '#5ca3af', '#ebc056', 
            '#6577c5', '#7ad3a5', '#d77e58', '#a2cf6e', 
            '#cf6ed1', '#6e8acf', '#cfae6e', '#cf6e8a'
          ],
          borderWidth: 1,
        },
      ],
    };
    
    return data;
  };
  
  const chartData = getChartData();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const topic = context.label;
            const value = context.raw;
            const { correct, total } = cumulativeTopicScores[topic];
            return `${topic}: ${correct}/${total} (${value}%)`;
          }
        }
      }
    }
  };

  return (
    <div id="review-section" className="review-section">
      <h2 className="review-title">Your Learning Progress</h2>
      
      <div className="stats-card">
        <div className="stats-header">
          <h3 className="stats-title">Overall Performance</h3>
        </div>
        <div className="stats-grid">
          <div className="stats-item">
            <div id="total-quizzes" className="stats-item-value">{totalQuizzes}</div>
            <div className="stats-item-label">Quizzes Taken</div>
          </div>
          <div className="stats-item">
            <div id="total-questions" className="stats-item-value">{totalQuestions}</div>
            <div className="stats-item-label">Questions Answered</div>
          </div>
          <div className="stats-item">
            <div id="correct-percentage" className="stats-item-value">{accuracy}%</div>
            <div className="stats-item-label">Accuracy</div>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)', justifySelf: 'center' }}>Overall Topic Performance</h3>
        {chartData ? (
          <div style={{ height: '400px', marginBottom: '20px', justifyItems: 'center' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>No data available</div>
        )}
      </div>
      
      <div id="all-topics-container">
        {availableTopics.length > 0 ? (
          availableTopics.map(topic => {
            const scores = cumulativeTopicScores[topic] || { total: 0, correct: 0 };
            const percentage = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
            const isAttempted = scores.total > 0;
            
            return (
              <div key={topic} className="topic-container">
                <div className="topic-header">
                  <div className="topic-title">{topic}</div>
                  <div className="topic-score">
                    {isAttempted ? (
                      `${scores.correct}/${scores.total} (${percentage}%)`
                    ) : (
                      "Not Attempted"
                    )}
                  </div>
                </div>
                <div className="topic-progress-bar">
                  {isAttempted ? (
                    <div 
                      className="topic-progress" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: percentage >= 80 ? '#8ac6d0' : 
                                       percentage >= 60 ? '#ffd166' : '#ff85a2'
                      }}
                    ></div>
                  ) : (
                    <div className="topic-not-attempted">
                      <span>No questions attempted for this topic</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            No topic data available. Complete some quizzes to see statistics.
          </div>
        )}
      </div>
      
      <div className="btn-group">
        <button id="back-to-home-btn-2" className="btn" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Stats; 