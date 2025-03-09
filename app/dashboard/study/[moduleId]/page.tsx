'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  BarChart, 
  Settings,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// Define the module type for better TypeScript support
interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  lastStudied: string;
  progress: number;
  topics: string[];
}

// Type the moduleData
const moduleData: Record<string, Module> = {
  'module-1': {
    id: 'module-1',
    number: 1,
    title: 'Mathematics',
    description: 'Arithmetic, algebra, geometry and basic trigonometry.',
    totalCards: 120,
    dueCards: 45,
    masteredCards: 20,
    lastStudied: '2 days ago',
    progress: 25,
    topics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry']
  },
  'module-3': {
    id: 'module-3',
    number: 3,
    title: 'Basic Electricity',
    description: 'Electron theory, static electricity, electrical terminology, and electrical hazards.',
    totalCards: 150,
    dueCards: 60,
    masteredCards: 35,
    lastStudied: 'Yesterday',
    progress: 45,
    topics: ['Electron Theory', 'Static Electricity', 'Electrical Terminology', 'DC Circuits', 'Resistors', 'Capacitors', 'Inductors']
  },
  // Add your other modules here
};

export default function ModuleStudySetupPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  
  const module = moduleData[moduleId];
  
  // Study session settings
  const [cardCount, setCardCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [studyMode, setStudyMode] = useState('spaced-repetition');
  const [includeAllTopics, setIncludeAllTopics] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(module?.topics || []);
  
  // If the module doesn't exist, show an error
  if (!module) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="mb-8 text-muted-foreground">The module you're looking for doesn't exist or hasn't been implemented yet.</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleStartStudy = () => {
    // Create the study session config
    const sessionConfig = {
      moduleId,
      cardCount,
      timeLimit: timeLimit ? timeLimitMinutes : null,
      mode: studyMode,
      topics: includeAllTopics ? module.topics : selectedTopics
    };
    
    // In a real app, you would save this to your state/database
    console.log('Starting study session with config:', sessionConfig);
    
    // Navigate to the study session page
    router.push(`/dashboard/study/session?moduleId=${moduleId}`);
  };
  
  // Rest of your component remains the same
  return (
    <div className="container max-w-4xl py-6">
      {/* Your existing JSX here */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Module Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Module {module.number}
              </Badge>
              {module.dueCards > 0 && (
                <Badge variant="secondary">
                  {module.dueCards} cards due
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{module.title}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{module.totalCards}</p>
                <p className="text-sm text-muted-foreground">Total Cards</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{module.masteredCards}</p>
                <p className="text-sm text-muted-foreground">Mastered</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{module.progress}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Study Session Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Study Session Setup</CardTitle>
            <CardDescription>Configure your study session parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Your existing form fields here */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button onClick={handleStartStudy}>
              Start Study Session
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}