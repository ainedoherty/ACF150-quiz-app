export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  topic?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  showResults: boolean;
  isLoading: boolean;
  error: string | null;
} 