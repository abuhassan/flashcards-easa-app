// types/api.ts

import { Quiz, QuizAttempt, QuizQuestion } from './quiz';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface QuizListResponse {
  success: boolean;
  quizzes?: Quiz[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

export interface QuizHistoryResponse {
  success: boolean;
  data?: QuizAttempt[];
  error?: string;
}

export interface QuizAttempResponse {
  success: boolean;
  data?: {
    attemptId: string;
  };
  error?: string;
}

export interface QuizQuestionsResponse {
  success: boolean;
  data?: {
    quiz: Quiz;
    questions: QuizQuestion[];
  };
  error?: string;
}