// app/actions/flashcard-actions.ts
"use server"

import  prisma  from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

interface CreateFlashcardInput {
  question: string;
  answer: string;
  moduleId: string;
  subModuleId?: string;
  difficulty: string;
  tags: string[];
  userId: string;
}

export async function createFlashcard(data: CreateFlashcardInput) {
  const session = await auth();
  
  // Verify user is authenticated and matches the userId provided
  if (!session?.user || session.user.id !== data.userId) {
    throw new Error("Unauthorized");
  }
  
  try {
    // Create the flashcard
    const flashcard = await prisma.flashcard.create({
      data: {
        question: data.question,
        answer: data.answer,
        moduleId: data.moduleId,
        subModuleId: data.subModuleId || null,
        difficulty: data.difficulty,
        tags: data.tags,
        userId: data.userId
      }
    });
    
    // Also create initial progress record
    await prisma.progress.create({
      data: {
        status: "new",
        nextReview: new Date(),
        reviewCount: 0,
        flashcardId: flashcard.id,
        userId: data.userId
      }
    });
    
    // Revalidate relevant paths
    revalidatePath(`/study/${data.moduleId}`);
    revalidatePath('/study');
    
    return { success: true, flashcardId: flashcard.id };
  } catch (error) {
    console.error("Error creating flashcard:", error);
    throw new Error("Failed to create flashcard");
  }
}