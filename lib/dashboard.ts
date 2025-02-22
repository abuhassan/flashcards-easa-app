// lib/dashboard.ts
import { prisma } from "./db"

export async function getDashboardStats(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get today's progress
  const todayProgress = await prisma.progress.count({
    where: {
      userId,
      updatedAt: {
        gte: today
      }
    }
  })

  // Get total cards for user
  const totalCards = await prisma.flashcard.count({
    where: {
      userId
    }
  })

  // Get mastered cards
  const masteredCards = await prisma.progress.count({
    where: {
      userId,
      status: "mastered"
    }
  })

  // Get next review cards
  const dueCards = await prisma.progress.findMany({
    where: {
      userId,
      nextReview: {
        lte: new Date()
      }
    },
    orderBy: {
      nextReview: 'asc'
    },
    take: 1
  })

  // Get recent activity
  const recentActivity = await prisma.progress.findMany({
    where: {
      userId
    },
    include: {
      flashcard: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 5
  })

  // Calculate study streak
  const streakDays = await calculateStreak(userId)

  return {
    todayProgress,
    totalCards,
    masteredCards,
    dueCards: dueCards.length,
    nextReview: dueCards[0]?.nextReview || null,
    recentActivity,
    streakDays
  }
}

async function calculateStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all study dates
  const studyDates = await prisma.progress.findMany({
    where: {
      userId,
      updatedAt: {
        gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    select: {
      updatedAt: true
    },
    distinct: ['updatedAt']
  })

  let streak = 0
  let currentDate = today

  // Count consecutive days
  for (let i = 0; i < 30; i++) {
    const hasStudied = studyDates.some(date => {
      const studyDate = new Date(date.updatedAt)
      return studyDate.toDateString() === currentDate.toDateString()
    })

    if (!hasStudied) break
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}