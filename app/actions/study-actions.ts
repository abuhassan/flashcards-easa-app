// actions/study-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma'
import { 
  createStudySession as importedCreateStudySession, 
  endStudySession, 
  addStudyRecord,
  getUserStudyStats,
  getUserModuleProgress
} from '@/lib/db';

// Helper function (not exported)
// Update your lookupModuleId function to look up by number
// Helper function (not exported)
async function lookupModuleId(moduleIdOrNumber: string) {
  // If it's a module number (like "1" or "module-1")
  let moduleNumber;
  
  if (moduleIdOrNumber.startsWith('module-')) {
    moduleNumber = moduleIdOrNumber.split('-')[1];
  } else if (!isNaN(Number(moduleIdOrNumber))) {
    moduleNumber = moduleIdOrNumber;
  }
  
  if (moduleNumber) {
    console.log(`Looking up module by number: ${moduleNumber}`);
    const module = await prisma.module.findFirst({
      where: { 
        number: moduleNumber.toString() 
      }
    });
    
    if (module) {
      console.log(`Found module: ${module.id} (${module.title})`);
      return module.id;
    } else {
      console.log(`No module found with number: ${moduleNumber}`);
      throw new Error(`Module number ${moduleNumber} not found`);
    }
  }
  
  // If we get here, assume moduleIdOrNumber is already an ID
  // Verify it exists
  const moduleExists = await prisma.module.findUnique({
    where: { id: moduleIdOrNumber }
  });
  
  if (!moduleExists) {
    console.log(`No module found with ID: ${moduleIdOrNumber}`);
    throw new Error(`Module with ID ${moduleIdOrNumber} not found`);
  }
  
  return moduleIdOrNumber;
}

export async function startStudySession(moduleId: string, subModuleId?: string) {
  // Get the current session
  const session = await auth();
  
  // TEMPORARY: Development-only auth bypass to enable testing with real data
  const userId = process.env.NODE_ENV === 'development' 
    ? "cm809bh0d0000lx9cuq5nnm5m" 
    : session?.user?.id;
    
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }
  
  try {
    // Look up the actual module ID
    const validModuleId = await lookupModuleId(moduleId);
    
    // Create the study session with the valid module ID
    const studySession = await importedCreateStudySession(userId, validModuleId, subModuleId);
    return { success: true, data: studySession };
  } catch (error) {
    console.error('Error starting study session:', error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create study session" };
  }
}


// Keep the original createStudySession function unchanged
async function createStudySession(userId: string, moduleId: string, subModuleId?: string) {
  return prisma.studySession.create({
    data: {
      userId,
      moduleId,
      subModuleId: subModuleId || null,
      startTime: new Date(),
    },
  });
}

export async function completeStudySession(
  sessionId: string, 
  data: {
    cardsStudied: number;
    correctCount: number;
    incorrectCount: number;
  }
) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const studySession = await endStudySession(sessionId, data);
    
    // Revalidate dashboard to update stats
    revalidatePath('/dashboard');
    
    return { success: true, data: studySession };
  } catch (error) {
    console.error('Error ending study session:', error);
    return { success: false, error: 'Failed to end study session' };
  }
}

export async function recordFlashcardResult(
  data: {
    flashcardId: string;
    studySessionId: string;
    rating: number;
    isCorrect: boolean;
    timeSpent?: number;
  }
) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const record = await addStudyRecord(data);
    
    // Update the user's progress for this flashcard
    // This would normally include your spaced repetition algorithm
    // For now, we'll just record the result
    
    return { success: true, data: record };
  } catch (error) {
    console.error('Error recording flashcard result:', error);
    return { success: false, error: 'Failed to record flashcard result' };
  }
}

export async function getStudyStats() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const stats = await getUserStudyStats(session.user.id);
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching study stats:', error);
    return { success: false, error: 'Failed to fetch study stats' };
  }
}

export async function getModuleProgress(moduleId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const progress = await getUserModuleProgress(session.user.id, moduleId);
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error fetching module progress:', error);
    return { success: false, error: 'Failed to fetch module progress' };
  }
}

// Function to get flashcards for a study session
export async function getFlashcardsForStudy(moduleId: string, count: number = 20) {
  const session = await auth();
  
  // Same auth bypass if needed
  const userId = process.env.NODE_ENV === 'development' 
    ? "cm809bh0d0000lx9cuq5nnm5m" 
    : session?.user?.id;
    
  if (!userId) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    console.log(`Fetching flashcards for module: ${moduleId}`);
    
    // Look up the actual module ID if needed
    const validModuleId = await lookupModuleId(moduleId);
    console.log(`Using validated module ID: ${validModuleId}`);
    
    // For now, we'll just get random cards from the module
    const flashcards = await prisma.flashcard.findMany({
      where: {
        moduleId: validModuleId,
      },
      take: count,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`Found ${flashcards.length} flashcards for module`);
    
    if (flashcards.length === 0) {
      return { 
        success: false, 
        error: 'No flashcards available for this module yet' 
      };
    }
    
    return { success: true, data: flashcards };
  } catch (error) {
    console.error('Error fetching flashcards for study:', error);
    return { success: false, error: 'Failed to fetch flashcards' };
  }
}

// Function to get a user's study history
export async function getStudyHistory() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const history = await prisma.studySession.findMany({
      where: {
        userId: session.user.id,
        endTime: { not: null }, // Only completed sessions
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        module: {
          select: {
            title: true,
            number: true,
          },
        },
      },
      take: 10, // Get the 10 most recent sessions
    });
    
    return { success: true, data: history };
  } catch (error) {
    console.error('Error fetching study history:', error);
    return { success: false, error: 'Failed to fetch study history' };
  }
}