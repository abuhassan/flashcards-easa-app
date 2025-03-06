// app/dashboard/flashcards/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import FlashcardList from '@/components/flashcards/flashcard-list';

// This would normally come from your database
// For now, we'll use sample data
const sampleFlashcards = [
  {
    id: '1',
    question: "What is Ohm's Law?",
    answer: "Ohm's Law states that current (I) is equal to voltage (V) divided by resistance (R): I = V/R.",
    module: {
      id: 'module-3',
      number: '3',
      title: 'Basic Electrical Knowledge'
    },
    difficulty: 'medium',
    tags: ['electrical', 'fundamentals'],
    userProgress: {
      confidenceLevel: 3,
      isLearned: false,
      isFavorite: true
    }
  },
  {
    id: '2',
    question: "What are the four forces acting on an aircraft in flight?",
    answer: "The four forces are: Lift, Weight, Thrust, and Drag.",
    module: {
      id: 'module-8',
      number: '8',
      title: 'Basic Aerodynamics'
    },
    difficulty: 'easy',
    tags: ['aerodynamics', 'forces'],
    userProgress: {
      confidenceLevel: 4,
      isLearned: true,
      isFavorite: false
    }
  }
];

function FlashcardsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  );
}

function FlashcardsContent() {
  // In a real implementation, you would fetch data from your API
  return <FlashcardList initialFlashcards={sampleFlashcards} />;
}

export default function FlashcardsPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Flashcards</h1>
          <p className="text-muted-foreground">Review and manage your EASA flashcards</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/flashcards/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create
            </Link>
          </Button>
        </div>
      </div>
      
      <Suspense fallback={<FlashcardsLoading />}>
        <FlashcardsContent />
      </Suspense>
    </div>
  );
}