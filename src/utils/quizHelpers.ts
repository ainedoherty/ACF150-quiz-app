import { Question } from '../types';

// Parse CSV data into question objects
export const parseCSV = (csvData: string): Question[] => {
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    const parts = line.split(',').map(part => part.trim());
    
    if (parts.length < 6) {
      throw new Error(`Line ${index + 1} does not have enough values. Expected at least 6 values.`);
    }
    
    const [question, ...options] = parts;
    const correctAnswer = parts[parts.length - 2];
    const topic = parts[parts.length - 1] || 'Unknown';
    
    // Remove the correct answer and topic from options array
    const cleanOptions = options.slice(0, options.length - 2);
    
    return {
      id: index + 1,
      question,
      options: cleanOptions,
      correctAnswer,
      topic
    };
  });
};

// Get preset quiz questions
export const getPresetQuiz = (presetName: string): Question[] => {
  // This would typically fetch data from an API or backend
  // For now, we'll return a small sample
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
      topic: 'Geography'
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars',
      topic: 'Astronomy'
    },
    {
      id: 3,
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      topic: 'Mathematics'
    },
  ];
  
  return sampleQuestions;
};

// Calculate achievement based on score percentage
export const getAchievement = (percentage: number): string => {
  if (percentage === 100) {
    return 'Perfect Score! You\'re a quiz master!';
  } else if (percentage >= 90) {
    return 'Outstanding! Nearly perfect!';
  } else if (percentage >= 80) {
    return 'Great job! You\'re well prepared!';
  } else if (percentage >= 70) {
    return 'Good work! Keep studying to improve!';
  } else if (percentage >= 60) {
    return 'Not bad! But room for improvement.';
  } else {
    return 'Keep practicing to improve your score!';
  }
}; 