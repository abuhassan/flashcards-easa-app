'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Pause,
  Settings,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  startStudySession,
  getFlashcardsForStudy,
  recordFlashcardResult,
  completeStudySession
} from '@/app/actions/study-actions';

// Module information lookup
const moduleInfo: Record<string, { number: number, title: string }> = {
  'module-1': { number: 1, title: 'Mathematics' },
  'module-3': { number: 3, title: 'Basic Electricity' },
  'module-4': { number: 4, title: 'Basic Electronics' },
  'module-8': { number: 8, title: 'Basic Aerodynamics' },
};

export default function StudySessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const mode = searchParams.get('mode') || 'normal';
  
  const [studySessionId, setStudySessionId] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [results, setResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    timeSpent: 0
  });
  
  // Get the current module info
  const getModuleInfo = (id: string | null) => {
    if (!id) return { number: 0, title: 'Unknown Module' };
    return moduleInfo[id] || { number: 0, title: 'Unknown Module' };
  };
  
  const currentCard = cards[currentCardIndex];
  const { number: moduleNumber, title: moduleTitle } = getModuleInfo(moduleId);
  
  // Initialize study session and load flashcards
  useEffect(() => {
    const initSession = async () => {
      if (!moduleId) {
        setError('No module selected');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Start a new study session
        const sessionResult = await startStudySession(moduleId);
        
        if (!sessionResult.success || !sessionResult.data) {
          setError(sessionResult.error || 'Failed to start study session');
          setIsLoading(false);
          return;
        }
        
        setStudySessionId(sessionResult.data.id);
        
        // Fetch flashcards for this session
        const flashcardsResult = await getFlashcardsForStudy(moduleId);
        
        if (!flashcardsResult.success) {
          setError(flashcardsResult.error || 'Failed to fetch flashcards');
          setIsLoading(false);
          return;
        }
        
        // TypeScript safety: ensure data exists before setting
        if (flashcardsResult.data) {
          setCards(flashcardsResult.data);
        } else {
          setCards([]);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing study session:', err);
        setError('An unexpected error occurred');
        setIsLoading(false);
      }
    };
    
    initSession();
  }, [moduleId]);
  
  // Format time as mm:ss
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Update timer every second
  useEffect(() => {
    if (isSessionPaused) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSessionPaused]);
  
  // Update progress when changing cards
  useEffect(() => {
    if (cards.length > 0) {
      setProgress(((currentCardIndex) / cards.length) * 100);
    }
  }, [currentCardIndex, cards.length]);
  
  // Handle card rating (difficulty feedback)
  const handleCardRating = async (rating: 'easy' | 'medium' | 'hard') => {
    if (!currentCard || !studySessionId) return;
    
    const isCorrect = rating === 'easy' || rating === 'medium';
    const ratingValue = rating === 'easy' ? 5 : rating === 'medium' ? 3 : 1;
    
    try {
      // Record this flashcard result in the database
      await recordFlashcardResult({
        flashcardId: currentCard.id,
        studySessionId,
        rating: ratingValue,
        isCorrect,
      });
      
      // Update local results state
      if (isCorrect) {
        setResults(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setResults(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
      
      // Move to the next card
      goToNextCard();
    } catch (err) {
      console.error('Error recording flashcard result:', err);
      // Continue anyway - we don't want to block the user's progress
      goToNextCard();
    }
  };
  
  // Go to the next card
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      endSession();
    }
  };
  
  // Skip the current card
  const skipCard = () => {
    setResults(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    goToNextCard();
  };
  
  // End the session
  const endSession = async () => {
    if (!studySessionId) return;
    
    const timeSpent = Date.now() - sessionStartTime;
    
    setResults(prev => ({
      ...prev,
      timeSpent,
    }));
    
    try {
      // Record session completion in the database
      await completeStudySession(studySessionId, {
        cardsStudied: currentCardIndex + 1,
        correctCount: results.correct,
        incorrectCount: results.incorrect
      });
    } catch (err) {
      console.error('Error completing study session:', err);
      // Continue anyway to show the completion screen
    }
    
    setShowSessionComplete(true);
  };
  
  // Toggle card flip
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Pause or resume the session
  const togglePause = () => {
    setIsSessionPaused(!isSessionPaused);
  };
  
  // Return to dashboard
  const returnToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="container max-w-3xl py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Study Session...</h1>
        <div className="flex justify-center">
          {/* Add a loading spinner or progress indicator here */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error || !moduleId || cards.length === 0) {
    return (
      <div className="container max-w-3xl py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Couldn't load flashcards for this module"}
          </p>
          <Button asChild>
            <Link href="/dashboard/study">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Study
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-6">
      {/* Session Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-primary">Module {moduleNumber}:</span> 
            <span className="ml-2">{moduleTitle}</span>
            {isSessionPaused && <Badge variant="secondary" className="ml-2">Paused</Badge>}
          </h1>
          <p className="text-muted-foreground">Study Session</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={togglePause}>
            {isSessionPaused ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Session Settings</DialogTitle>
                <DialogDescription>Adjust your study session parameters</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Changing session settings will apply to the remaining cards in your session.
                </p>
                {/* Additional settings would go here */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={endSession}>End Session</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Session Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <div>
            Card {currentCardIndex + 1} of {cards.length}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(currentTime - sessionStartTime)}
          </div>
        </div>
        <Progress value={progress} />
      </div>
      
      {/* Flashcard */}
      {!showSessionComplete && currentCard && (
        <div className="mb-6">
          <div
            className="relative cursor-pointer min-h-64 transition-all duration-500"
            onClick={flipCard}
          >
            {/* Front of card */}
            {!isFlipped ? (
              <Card className="w-full min-h-64">
                <CardHeader className="flex flex-row justify-between items-center text-sm text-muted-foreground">
                  <Badge variant="outline">{currentCard.topic?.name || 'General'}</Badge>
                  <Badge variant="secondary">Tap to flip</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <div className="text-lg md:text-xl">{currentCard.question}</div>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <div className="text-xs text-muted-foreground">
                    Difficulty: {currentCard.difficulty}
                  </div>
                </CardFooter>
              </Card>
            ) : (
              /* Back of card */
              <Card className="w-full min-h-64">
                <CardHeader className="flex flex-row justify-between items-center text-sm text-muted-foreground">
                  <Badge variant="outline">{currentCard.topic?.name || 'General'}</Badge>
                  <Badge variant="secondary">Answer</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <div className="text-lg md:text-xl">{currentCard.answer}</div>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <div className="text-xs text-muted-foreground">
                    Difficulty: {currentCard.difficulty}
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
          
          {/* Rating Buttons - only shown when card is flipped */}
          {isFlipped && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Button 
                variant="outline" 
                className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:hover:bg-red-900 dark:text-red-400 dark:hover:text-red-300"
                onClick={() => handleCardRating('hard')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Hard
              </Button>
              <Button 
                variant="outline"
                className="border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/50 dark:hover:bg-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                onClick={() => handleCardRating('medium')}
              >
                Okay
              </Button>
              <Button 
                variant="outline"
                className="border-green-200 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:hover:bg-green-900 dark:text-green-400 dark:hover:text-green-300"
                onClick={() => handleCardRating('easy')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Easy
              </Button>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button variant="ghost" size="sm" onClick={skipCard}>
              Skip
            </Button>
            
            <div className="flex space-x-2">
              {currentCardIndex > 0 && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setCurrentCardIndex(currentCardIndex - 1);
                    setIsFlipped(false);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              {currentCardIndex < cards.length - 1 && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setCurrentCardIndex(currentCardIndex + 1);
                    setIsFlipped(false);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Session Complete Dialog */}
      {showSessionComplete && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-3">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Session Complete!</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-bold">{results.correct}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-bold">{results.incorrect}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-bold">{results.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Session Summary</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You've studied {currentCardIndex + 1} cards from Module {moduleNumber}: {moduleTitle}.
              </p>
              {currentCard && (
                <p className="text-sm text-muted-foreground">
                  Based on your performance, we recommend reviewing this module again in 3 days.
                </p>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-3">What's next?</h3>
            <div className="space-y-2">
              {moduleId && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/dashboard/study/${moduleId}`}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Study This Module Again
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/modules">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse All Modules
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={returnToDashboard}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}