'use client';

// app/dashboard/study/session/page.tsx
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

// Sample flashcard data - in a real app, this would come from your database
const flashcardData = {
  'module-1': [
    { id: 1, front: 'What is the formula for the area of a circle?', back: 'A = πr²', topic: 'Geometry', difficulty: 'medium' },
    { id: 2, front: 'What is the Pythagorean theorem?', back: 'a² + b² = c²', topic: 'Geometry', difficulty: 'easy' },
    { id: 3, front: 'What is the formula for the volume of a cylinder?', back: 'V = πr²h', topic: 'Geometry', difficulty: 'medium' },
    { id: 4, front: 'What is the formula for calculating sin(A+B)?', back: 'sin(A+B) = sinA·cosB + cosA·sinB', topic: 'Trigonometry', difficulty: 'hard' },
    { id: 5, front: 'How do you solve a quadratic equation?', back: 'Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a', topic: 'Algebra', difficulty: 'medium' },
  ],
  'module-3': [
    { id: 1, front: 'What is Ohm\'s Law?', back: 'V = IR, where V is voltage, I is current, and R is resistance', topic: 'DC Circuits', difficulty: 'easy' },
    { id: 2, front: 'What is the formula for calculating power in a DC circuit?', back: 'P = VI or P = I²R or P = V²/R', topic: 'DC Circuits', difficulty: 'medium' },
    { id: 3, front: 'What is a capacitor?', back: 'A device that stores electrical energy in an electric field', topic: 'Capacitors', difficulty: 'easy' },
    { id: 4, front: 'What is the formula for capacitive reactance?', back: 'Xc = 1/(2πfC)', topic: 'Capacitors', difficulty: 'hard' },
    { id: 5, front: 'What is an inductor?', back: 'A passive electrical component that stores energy in a magnetic field when electric current flows through it', topic: 'Inductors', difficulty: 'medium' },
  ],
  'module-4': [
    { id: 1, front: 'What is a diode?', back: 'A semiconductor device that allows current to flow in one direction only', topic: 'Semiconductors', difficulty: 'easy' },
    { id: 2, front: 'What is a transistor?', back: 'A semiconductor device used to amplify or switch electronic signals', topic: 'Semiconductors', difficulty: 'medium' },
    { id: 3, front: 'What is the difference between NPN and PNP transistors?', back: 'NPN uses electrons as carriers, while PNP uses holes. The arrow on the emitter points out for NPN and in for PNP.', topic: 'Semiconductors', difficulty: 'hard' },
    { id: 4, front: 'What is a PCB?', back: 'Printed Circuit Board - a board that connects electronic components using conductive tracks', topic: 'Printed Circuit Boards', difficulty: 'easy' },
    { id: 5, front: 'What is the purpose of soldermask on a PCB?', back: 'To protect the copper traces from oxidation and to prevent solder bridges from forming during assembly', topic: 'Printed Circuit Boards', difficulty: 'medium' },
  ],
  'module-8': [
    { id: 1, front: 'What is the standard atmospheric pressure at sea level?', back: '1013.25 hPa (hectopascals) or 29.92 inches of mercury', topic: 'Physics of the Atmosphere', difficulty: 'medium' },
    { id: 2, front: 'What is lift?', back: 'The aerodynamic force that opposes weight and keeps an aircraft in the air', topic: 'Aerodynamics', difficulty: 'easy' },
    { id: 3, front: 'What is angle of attack?', back: 'The angle between the chord line of the wing and the relative airflow', topic: 'Aerodynamics', difficulty: 'medium' },
    { id: 4, front: 'What is the purpose of an aircraft\'s vertical stabilizer?', back: 'To provide directional stability and prevent yaw (side-to-side motion)', topic: 'Flight Stability', difficulty: 'medium' },
    { id: 5, front: 'What are the three axes of aircraft motion?', back: 'Longitudinal (roll), Lateral (pitch), and Vertical (yaw)', topic: 'Flight Dynamics', difficulty: 'hard' },
  ],
};

// Module information
const moduleInfo = {
  'module-1': { number: 1, title: 'Mathematics' },
  'module-3': { number: 3, title: 'Basic Electricity' },
  'module-4': { number: 4, title: 'Basic Electronics' },
  'module-8': { number: 8, title: 'Basic Aerodynamics' },
};

export default function StudySessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId') || 'module-1';
  
  const [cards, setCards] = useState(flashcardData[moduleId as keyof typeof flashcardData] || []);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  
  const [results, setResults] = useState<{
    correct: number;
    incorrect: number;
    skipped: number;
    timeSpent: number;
  }>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    timeSpent: 0
  });
  
  const currentCard = cards[currentCardIndex];
  const moduleTitle = moduleInfo[moduleId as keyof typeof moduleInfo]?.title || 'Unknown Module';
  const moduleNumber = moduleInfo[moduleId as keyof typeof moduleInfo]?.number || 0;
  
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
    setProgress(((currentCardIndex) / cards.length) * 100);
  }, [currentCardIndex, cards.length]);
  
  // Handle card rating (difficulty feedback)
  const handleCardRating = (rating: 'easy' | 'medium' | 'hard') => {
    // In a real app, you would update the card's spaced repetition algorithm data here
    console.log(`Card ${currentCard.id} rated as ${rating}`);
    
    // For this example, we'll just track correct/incorrect
    if (rating === 'easy' || rating === 'medium') {
      setResults(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setResults(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    
    // Move to the next card or end session
    goToNextCard();
  };
  
  // Go to the next card
  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      setResults(prev => ({
        ...prev,
        timeSpent: Date.now() - sessionStartTime,
      }));
      setShowSessionComplete(true);
    }
  };
  
  // Skip the current card
  const skipCard = () => {
    setResults(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    goToNextCard();
  };
  
  // End the session early
  const endSession = () => {
    setResults(prev => ({
      ...prev,
      timeSpent: Date.now() - sessionStartTime,
    }));
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
                  <Badge variant="outline">{currentCard.topic}</Badge>
                  <Badge variant="secondary">Tap to flip</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <div className="text-lg md:text-xl">{currentCard.front}</div>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <div className="text-xs text-muted-foreground">Topic: {currentCard.topic}</div>
                </CardFooter>
              </Card>
            ) : (
              /* Back of card */
              <Card className="w-full min-h-64">
                <CardHeader className="flex flex-row justify-between items-center text-sm text-muted-foreground">
                  <Badge variant="outline">{currentCard.topic}</Badge>
                  <Badge variant="secondary">Answer</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-center">
                  <div className="text-lg md:text-xl">{currentCard.back}</div>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <div className="text-xs text-muted-foreground">Topic: {currentCard.topic}</div>
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
              <p className="text-sm text-muted-foreground">
                Based on your performance, we recommend reviewing the {currentCard.topic} topic again in 3 days.
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-3">What's next?</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/study/${moduleId}`}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Study This Module Again
                </Link>
              </Button>
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