'use server';

import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

// Initialize Prisma client
const prisma = new PrismaClient();

// Types for better TypeScript support
type QuizFilterParams = {
  moduleId?: string;
  search?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
};

type QuizAnswerSubmission = {
  attemptId: string;
  questionId: string;
  answer: string;
};

// Get all quizzes with optional filtering
export async function getQuizzes(params: QuizFilterParams = {}) {
  try {
    console.log("getQuizzes called with params:", params);
    const { moduleId, search, difficulty, page = 1, limit = 10 } = params;
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Build query filters
    const filters: any = {};
    
    if (moduleId) {
      filters.moduleId = moduleId;
    }
    
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (difficulty && difficulty !== 'all') {
      filters.difficulty = difficulty;
    }

    // Fetch quizzes from database
    const quizzes = await prisma.quiz.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        module: true,
        _count: {
          select: { questions: true }
        }
      }
    });

    console.log(`Found ${quizzes.length} quizzes`);

    // Count total matching quizzes for pagination
    const totalQuizzes = await prisma.quiz.count({ where: filters });

    // Transform data for client consumption
    const transformedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      // Since your schema uses totalQuestions directly, not passingScore
      totalQuestions: quiz.totalQuestions,
      module: {
        id: quiz.module.id,
        title: quiz.module.title,
        number: quiz.module.number,
      },
      createdAt: quiz.createdAt.toISOString(),
    }));

    return {
      success: true,
      quizzes: transformedQuizzes,
      pagination: {
        total: totalQuizzes,
        pageCount: Math.ceil(totalQuizzes / limit),
        page,
        limit
      }
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return { success: false, error: 'Failed to fetch quizzes' };
  }
}

// Start a new quiz attempt
export async function startQuizAttempt(quizId: string) {
  try {
    console.log("startQuizAttempt called for quiz ID:", quizId);
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Make sure the quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    // Create a new attempt in the database
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        // No status field in your schema
      }
    });

    console.log("Created quiz attempt:", attempt.id);
    revalidatePath('/dashboard/quizzes');
    
    return {
      success: true,
      data: {
        attemptId: attempt.id
      }
    };
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    return { success: false, error: 'Failed to start quiz' };
  }
}

// Get questions for a quiz attempt
export async function getQuizQuestions(attemptId: string) {
  try {
    console.log("getQuizQuestions called for attempt ID:", attemptId);
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Get the attempt
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
        userId
      },
      include: {
        quiz: true
      }
    });

    if (!attempt) {
      console.error("Quiz attempt not found");
      return { success: false, error: 'Quiz attempt not found' };
    }

    console.log("Found attempt for quiz:", attempt.quiz.title);

    // Get all quiz questions for this quiz with their related questions
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: {
        quizId: attempt.quizId
      },
      include: {
        question: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    console.log(`Found ${quizQuestions.length} questions for this quiz`);

    // Get existing answers for this attempt
    const answers = await prisma.quizAnswer.findMany({
      where: {
        attemptId: attemptId
      }
    });

    // Transform questions for the client
    const transformedQuestions = quizQuestions.map(quizQuestion => {
      const question = quizQuestion.question;
      // Parse options from JSON
      const options = JSON.parse(question.options as string) as Array<{ id: string; text: string }>;

      // In getQuizQuestions in quiz-actions.ts, add before returning the data:
      console.log("Question data from database:", transformedQuestions);
      
      // Find the answer for this question if it exists
      const existingAnswer = answers.find(a => a.questionId === question.id);
      
      return {
        id: question.id,
        text: question.text,
        options: options,
        userAnswer: existingAnswer?.answer || null,
        isFlagged: existingAnswer?.isFlagged || false
      };
    });

    console.log("Returning transformed questions");
    return {
      success: true,
      data: transformedQuestions
    };
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return { success: false, error: 'Failed to fetch questions' };
  }
}

// Submit an answer for a question
export async function submitQuizAnswer(params: QuizAnswerSubmission) {
  try {
    console.log("submitQuizAnswer called with params:", params);
    const { attemptId, questionId, answer } = params;
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the attempt exists and belongs to the user
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
        userId
      }
    });

    if (!attempt) {
      return { success: false, error: 'Quiz attempt not found' };
    }

    // Get the question to check if the answer is correct
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return { success: false, error: 'Question not found' };
    }

    // Check if the answer is correct
    const isCorrect = question.correctAnswer === answer;

    // Check if an answer already exists
    const existingAnswer = await prisma.quizAnswer.findFirst({
      where: {
        attemptId,
        questionId
      }
    });

    if (existingAnswer) {
      // Update existing answer
      await prisma.quizAnswer.update({
        where: {
          id: existingAnswer.id
        },
        data: {
          answer,
          isCorrect
        }
      });
      console.log("Updated existing answer");
    } else {
      // Create new answer
      await prisma.quizAnswer.create({
        data: {
          attemptId,
          questionId,
          userId,
          answer,
          isCorrect,
          isFlagged: false
        }
      });
      console.log("Created new answer");
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting answer:", error);
    return { success: false, error: 'Failed to submit answer' };
  }
}

// Flag or unflag a question
export async function flagQuizQuestion(params: { attemptId: string; questionId: string; flagged: boolean }) {
  try {
    console.log("flagQuizQuestion called with params:", params);
    const { attemptId, questionId, flagged } = params;
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Check if the attempt exists and belongs to the user
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
        userId
      }
    });

    if (!attempt) {
      return { success: false, error: 'Quiz attempt not found' };
    }

    // Check if an answer already exists
    const existingAnswer = await prisma.quizAnswer.findFirst({
      where: {
        attemptId,
        questionId
      }
    });

    if (existingAnswer) {
      // Update existing answer with flag
      await prisma.quizAnswer.update({
        where: {
          id: existingAnswer.id
        },
        data: {
          isFlagged: flagged
        }
      });
      console.log("Updated flag on existing answer");
    } else {
      // Create new answer with just the flag
      await prisma.quizAnswer.create({
        data: {
          attemptId,
          questionId,
          userId,
          answer: '', // Default empty answer
          isCorrect: false, // Default to incorrect since no answer
          isFlagged: flagged
        }
      });
      console.log("Created new answer with flag");
    }

    return { success: true };
  } catch (error) {
    console.error("Error flagging question:", error);
    return { success: false, error: 'Failed to update flag status' };
  }
}

// Handle navigation between questions (optional)
export async function navigateQuizQuestion(params: {
  attemptId: string;
  currentQuestionId: string;
  direction: 'next' | 'previous';
}) {
  console.log("navigateQuizQuestion called:", params);
  // This function can be used to track user navigation patterns
  // or update last visited question, etc.
  // For now, just return success
  return { success: true };
}

// Get quiz history for current user
export async function getQuizHistory() {
  try {
    console.log("getQuizHistory called");
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Get completed quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null } // Only completed attempts
      },
      include: {
        quiz: {
          include: {
            module: true
          }
        },
        answers: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    console.log(`Found ${attempts.length} completed quiz attempts`);

    // Transform attempts data
    const transformedAttempts = attempts.map(attempt => {
      // Calculate score
      const totalAnswered = attempt.answers.length;
      const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
      const score = totalAnswered > 0 
        ? (correctAnswers / totalAnswered) * 100 
        : 0;
      
      return {
        id: attempt.id,
        quizId: attempt.quizId,
        quizTitle: attempt.quiz.title,
        moduleNumber: attempt.quiz.module.number,
        moduleName: attempt.quiz.module.title, // Assuming module.title is used as name
        startedAt: attempt.startedAt.toISOString(),
        completedAt: attempt.completedAt?.toISOString(),
        score: attempt.score !== null ? attempt.score : score,
        totalQuestions: attempt.quiz.totalQuestions,
        answeredQuestions: totalAnswered,
        correctAnswers,
        isPassed: attempt.isPassed !== null ? attempt.isPassed : (score >= 70) // Assuming 70% is passing
      };
    });

    return {
      success: true,
      data: transformedAttempts
    };
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return { success: false, error: 'Failed to fetch quiz history' };
  }
}

// Complete a quiz attempt
export async function completeQuizAttempt(attemptId: string) {
  try {
    console.log("completeQuizAttempt called for attemptId:", attemptId);
    const session = await auth();
    
    // TEMPORARY: Development-only auth bypass
    const userId = process.env.NODE_ENV === 'development' 
      ? "cm809bh0d0000lx9cuq5nnm5m" 
      : session?.user?.id;
    
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    // Get the attempt
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
        userId
      },
      include: {
        quiz: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!attempt) {
      console.error("Quiz attempt not found");
      return { success: false, error: 'Quiz attempt not found' };
    }

    console.log(`Processing completion for quiz: ${attempt.quiz.title}`);

    // Calculate score
    const totalQuestions = attempt.quiz.totalQuestions;
    const answeredQuestions = attempt.answers.length;
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    
    const score = totalQuestions > 0 
      ? (correctAnswers / totalQuestions) * 100 
      : 0;
    
    // Assuming 70% is passing score
    const isPassed = score >= 70;

    // Complete the attempt
    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        completedAt: new Date(),
        score,
        isPassed
      }
    });

    console.log(`Quiz completed with score: ${score}%`);
    revalidatePath(`/dashboard/quizzes/results/${attemptId}`);

    return {
      success: true,
      data: {
        attemptId,
        score,
        totalQuestions,
        answeredQuestions,
        correctAnswers,
        isPassed
      }
    };
  } catch (error) {
    console.error("Error completing quiz:", error);
    return { success: false, error: 'Failed to complete quiz' };
  }
}