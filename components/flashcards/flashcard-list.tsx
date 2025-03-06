// components/flashcards/flashcard-list.tsx
"use client";

import { useState } from 'react';
import FlashcardCard from './flashcard-card';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  module: {
    id: string;
    title: string;
    number: string;
  };
  difficulty: string;
  tags: string[];
  userProgress?: {
    confidenceLevel?: number;
    isLearned?: boolean;
    isFavorite?: boolean;
  };
};

type FlashcardListProps = {
  initialFlashcards: Flashcard[];
};

export default function FlashcardList({ initialFlashcards }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  
  const handleFlashcardUpdate = (id: string, data: any) => {
    setFlashcards(cards => 
      cards.map(card => 
        card.id === id 
          ? { ...card, userProgress: { ...card.userProgress, ...data } } 
          : card
      )
    );
  };
  
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No flashcards found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {flashcards.map(flashcard => (
        <FlashcardCard
          key={flashcard.id}
          id={flashcard.id}
          question={flashcard.question}
          answer={flashcard.answer}
          module={flashcard.module}
          difficulty={flashcard.difficulty}
          tags={flashcard.tags}
          userProgress={flashcard.userProgress}
          onUpdate={handleFlashcardUpdate}
        />
      ))}
    </div>
  );
}