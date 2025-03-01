'use server';

import { auth } from '@/lib/auth';
import prisma from '../../../lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Delete a flashcard
export async function deleteFlashcard(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  // Check if the flashcard belongs to the user
  const flashcard = await prisma.flashcard.findUnique({
    where: { id },
    select: { userId: true },
  });
  
  if (!flashcard || flashcard.userId !== session.user.id) {
    throw new Error('Flashcard not found or unauthorized');
  }
  
  // Delete related progress first (to avoid foreign key constraint errors)
  await prisma.progress.deleteMany({
    where: { flashcardId: id },
  });
  
  // Delete the flashcard
  await prisma.flashcard.delete({
    where: { id },
  });
  
  revalidatePath('/dashboard/flashcards');
  
  return { success: true };
}

// Flashcard form schema
const FlashcardSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, 'Question must be at least 3 characters'),
  answer: z.string().min(3, 'Answer must be at least 3 characters'),
  module: z.string(),
  subModule: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()),
});

export type FlashcardFormData = z.infer<typeof FlashcardSchema>;

// Create or update a flashcard
export async function saveFlashcard(data: FlashcardFormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  try {
    // Validate form data
    const validatedData = FlashcardSchema.parse(data);
    
    if (validatedData.id) {
      // Update existing flashcard
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: validatedData.id },
        select: { userId: true },
      });
      
      if (!flashcard || flashcard.userId !== session.user.id) {
        throw new Error('Flashcard not found or unauthorized');
      }
      
      const updatedFlashcard = await prisma.flashcard.update({
        where: { id: validatedData.id },
        data: {
          question: validatedData.question,
          answer: validatedData.answer,
          module: validatedData.module,
          subModule: validatedData.subModule,
          difficulty: validatedData.difficulty,
          tags: validatedData.tags,
        },
      });
      
      revalidatePath('/dashboard/flashcards');
      
      return { success: true, flashcard: updatedFlashcard };
    } else {
      // Create new flashcard
      const newFlashcard = await prisma.flashcard.create({
        data: {
          question: validatedData.question,
          answer: validatedData.answer,
          module: validatedData.module,
          subModule: validatedData.subModule || null,
          difficulty: validatedData.difficulty,
          tags: validatedData.tags,
          userId: session.user.id,
          // Create initial progress record
          progress: {
            create: {
              status: 'new',
              userId: session.user.id,
            },
          },
        },
      });
      
      revalidatePath('/dashboard/flashcards');
      
      return { success: true, flashcard: newFlashcard };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0].message 
      };
    }
    
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}