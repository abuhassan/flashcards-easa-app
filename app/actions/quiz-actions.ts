"use server";

import { prisma } from "@/lib/prisma";
import { Quiz, QuizAttempt, QuizQuestion, QuizAnswer } from "@prisma/client";

// Get a list of quizzes with optional filters
export async function getQuizzes({
  search = "",
  difficulty = "",
  page = 1,
  limit = 10
}: { search?: string; difficulty?: string; page?: number; limit?: number }) {
  try {
    console.log("getQuizzes called with params:", { search, difficulty });

    const filters: any = {};
    if (search) filters.title = { contains: search, mode: "insensitive" };
    if (difficulty) filters.difficulty = difficulty;

    const quizzes: Quiz[] = await prisma.quiz.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
}

// Get a single quiz by ID
export async function getQuizById(quizId: string) {
  try {
    return await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            quizQuestions: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw new Error("Failed to fetch quiz");
  }
}

// Get quiz history for a user
export async function getQuizHistory(userId: string) {
  try {
    console.log("getQuizHistory called");

    const attempts: QuizAttempt[] = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }
      },
      include: {
        quiz: true
      },
      orderBy: { completedAt: "desc" }
    });

    return attempts;
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    throw new Error("Failed to fetch quiz history");
  }
}

// Submit a quiz attempt
export async function submitQuizAttempt({
  userId,
  quizId,
  answers
}: {
  userId: string;
  quizId: string;
  answers: { questionId: string; answer: string }[];
}) {
  try {
    console.log("submitQuizAttempt called");

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        startedAt: new Date(),
        completedAt: new Date(),
        score: 0,
        isPassed: false
      }
    });

    let correctCount = 0;

    for (const answer of answers) {
      const correct = await prisma.quizQuestion.findUnique({
        where: { id: answer.questionId }
      });

      const isCorrect = correct?.correctAnswer === answer.answer;
      if (isCorrect) correctCount++;

      await prisma.quizAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: answer.questionId,
          userId,
          answer: answer.answer,
          isCorrect
        }
      });
    }

    const totalQuestions = answers.length;
    const score = (correctCount / totalQuestions) * 100;

    const isPassed = score >= 70; // Example passing score

    return await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { score, isPassed }
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    throw new Error("Failed to submit quiz attempt");
  }
}

// Sort quizzes by most recent
export function sortQuizzes(quizzes: Quiz[]) {
  return quizzes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Sort quiz attempts by score
export function sortQuizAttempts(attempts: QuizAttempt[]) {
  return attempts.sort((a, b) => b.score! - a.score!);
}
      