// types/quiz.ts

export interface QuizModule {
  id?: string;
  title: string;
  number: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;  // Allow both undefined and null
  difficulty: string;
  timeLimit?: number | null;    // Allow both undefined and null
  moduleId: string;
  module: {
    title: string;
    number: string;
  };
  totalQuestions: number;
  hasAttempted?: boolean;
  bestScore?: number | null;
  bestAttemptId?: string | null;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;      // May not be exposed to the user during the quiz
  explanation?: string | null; // Allow both undefined and null
  difficulty?: string;         // Make optional to match API response
  order?: number;
  userAnswer?: string | null;
  isFlagged?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  moduleId: string;
  moduleName: string;
  moduleNumber: string;
  score?: number | null;
  isPassed?: boolean | null;
  completedAt?: Date | null;
  timeTaken?: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent?: number;
  isFlagged?: boolean;
}

// Helper function to safely cast API response to Quiz type
export function safelyMapQuiz(apiQuiz: any): Quiz {
  return {
    id: apiQuiz.id,
    title: apiQuiz.title,
    description: apiQuiz.description,
    difficulty: apiQuiz.difficulty,
    timeLimit: apiQuiz.timeLimit,
    moduleId: apiQuiz.moduleId || "", // Provide default value
    module: {
      title: apiQuiz.module?.title || "",
      number: apiQuiz.module?.number || ""
    },
    totalQuestions: apiQuiz.totalQuestions || 0, // Provide default value
    hasAttempted: apiQuiz.hasAttempted || false,
    bestScore: apiQuiz.bestScore,
    bestAttemptId: apiQuiz.bestAttemptId
  };
}

// Helper function to safely cast API response to QuizQuestion type
export function safelyMapQuizQuestion(apiQuestion: any): QuizQuestion {
  return {
    id: apiQuestion.id,
    text: apiQuestion.text,
    options: apiQuestion.options || [],
    correctAnswer: apiQuestion.correctAnswer,
    explanation: apiQuestion.explanation,
    difficulty: apiQuestion.difficulty || "medium", // Default to medium
    order: apiQuestion.order,
    userAnswer: apiQuestion.userAnswer,
    isFlagged: apiQuestion.isFlagged || false
  };
}

// Helper functions to safely map collections
export function safelyMapQuizzes(apiQuizzes: any[]): Quiz[] {
  return (apiQuizzes || []).map(safelyMapQuiz);
}

export function safelyMapQuizQuestions(apiQuestions: any[]): QuizQuestion[] {
  return (apiQuestions || []).map(safelyMapQuizQuestion);
}

export function safelyMapQuizAttempts(apiAttempts: any[]): QuizAttempt[] {
  return (apiAttempts || []).map(attempt => ({
    id: attempt.id,
    quizId: attempt.quizId,
    quizTitle: attempt.quizTitle,
    moduleId: attempt.moduleId,
    moduleName: attempt.moduleName,
    moduleNumber: attempt.moduleNumber,
    score: attempt.score,
    isPassed: attempt.isPassed,
    completedAt: attempt.completedAt,
    timeTaken: attempt.timeTaken
  }));
}