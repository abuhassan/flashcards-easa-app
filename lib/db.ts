// lib/db.ts
import prisma from '@/lib/prisma';
import { StudySession } from '@prisma/client';

// Study session operations
export async function createStudySession(userId: string, moduleId?: string, subModuleId?: string) {
  return prisma.studySession.create({
    data: {
      userId,
      moduleId,
      subModuleId,
    },
  });
}

export async function endStudySession(id: string, data: {
  endTime?: Date;
  cardsStudied: number;
  correctCount: number;
  incorrectCount: number;
}) {
  return prisma.studySession.update({
    where: { id },
    data: {
      ...data,
      endTime: data.endTime || new Date(),
    },
  });
}

export async function addStudyRecord(data: {
  flashcardId: string;
  studySessionId: string;
  rating: number;
  isCorrect: boolean;
  timeSpent?: number;
}) {
  return prisma.studyRecord.create({
    data,
  });
}

// Analytics queries
export async function getUserStudyStats(userId: string) {
  // Get total study time
  const studySessions = await prisma.studySession.findMany({
    where: {
      userId,
      endTime: { not: null },
    },
    select: {
      startTime: true,
      endTime: true,
      cardsStudied: true,
      correctCount: true,
      incorrectCount: true,
    },
  });
  
  type SessionStats = {
    startTime: Date;
    endTime: Date | null;
    cardsStudied: number;
    correctCount: number;
    incorrectCount: number;
  };
  
  // Calculate total study time in minutes
  const totalStudyTime = studySessions.reduce((total: number, session: SessionStats) => {
    if (session.endTime) {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      return total + duration;
    }
    return total;
  }, 0) / (1000 * 60); // Convert to minutes
  
  // Get total cards studied
  const totalCardsStudied = studySessions.reduce((total: number, session: SessionStats) => {
    return total + session.cardsStudied;
  }, 0);
  
  // Get correct percentage
  const totalCorrect = studySessions.reduce((total: number, session: SessionStats) => {
    return total + session.correctCount;
  }, 0);
  
  const correctPercentage = totalCardsStudied > 0 
    ? (totalCorrect / totalCardsStudied) * 100 
    : 0;
  
  // Get cards mastered (cards with isLearned = true)
  const cardsMastered = await prisma.progress.count({
    where: {
      userId,
      isLearned: true,
    },
  });
  
  return {
    totalStudyTime: Math.round(totalStudyTime),
    totalCardsStudied,
    correctPercentage: Math.round(correctPercentage),
    cardsMastered,
    sessionCount: studySessions.length,
  };
}

// Module progress
export async function getUserModuleProgress(userId: string, moduleId: string) {
  // Get total flashcards for module
  const totalCards = await prisma.flashcard.count({
    where: { moduleId },
  });
  
  // Get mastered cards for user in this module
  const masteredCards = await prisma.progress.count({
    where: {
      userId,
      isLearned: true,
      flashcard: {
        moduleId,
      },
    },
  });
  
  // Calculate completion percentage
  const completionPercentage = totalCards > 0 
    ? (masteredCards / totalCards) * 100 
    : 0;
  
  return {
    totalCards,
    masteredCards,
    completionPercentage: Math.round(completionPercentage),
  };
}