'use client';

// app/dashboard/study/[moduleId]/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

// Sample module data - this would come from your database
const moduleData = {
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
  'module-4': {
    id: 'module-4',
    number: 4,
    title: 'Basic Electronics',
    description: 'Semiconductors, printed circuit boards, and electronic instruments.',
    totalCards: 130,
    dueCards: 80,
    masteredCards: 10,
    lastStudied: '5 days ago',
    progress: 10,
    topics: ['Semiconductors', 'Printed Circuit Boards', 'Servomechanisms', 'Electronic Instruments']
  },
  'module-8': {
    id: 'module-8',
    number: 8,
    title: 'Basic Aerodynamics',
    description: 'Physics of the atmosphere, aerodynamics, and flight stability and dynamics.',
    totalCards: 100,
    dueCards: 100,
    masteredCards: 0,
    lastStudied: 'Not started',
    progress: 0,
    topics: ['Physics of the Atmosphere', 'Aerodynamics', 'Flight Stability', 'Flight Dynamics']
  }
};

export default function ModuleStudySetupPage({ params }: { params: { moduleId: string } }) {
  const router = useRouter();
  const moduleId = params.moduleId;
  const module = moduleData[moduleId as keyof typeof moduleData];
  
  // Study session settings
  const [cardCount, setCardCount] = useState(20); // Default to 20 cards
  const [timeLimit, setTimeLimit] = useState(false); // No time limit by default
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15); // Default 15 minutes
  const [studyMode, setStudyMode] = useState('spaced-repetition'); // Default to spaced repetition
  const [includeAllTopics, setIncludeAllTopics] = useState(true); // Include all topics by default
  const [selectedTopics, setSelectedTopics] = useState<string[]>(module.topics);
  
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
  
  return (
    <div className="container max-w-4xl py-6">
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
            {/* Card Count */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="card-count">Number of Cards</Label>
                <span className="font-medium">{cardCount} cards</span>
              </div>
              <Slider
                id="card-count"
                min={5}
                max={50}
                step={5}
                value={[cardCount]}
                onValueChange={(value) => setCardCount(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Choose how many cards you want to study in this session. We recommend 15-20 for optimal learning.
              </p>
            </div>
            
            {/* Time Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-limit" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Time Limit
                </Label>
                <Switch
                  id="time-limit"
                  checked={timeLimit}
                  onCheckedChange={setTimeLimit}
                />
              </div>
              {timeLimit && (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <Label htmlFor="time-limit-minutes">Session Length</Label>
                    <span className="font-medium">{timeLimitMinutes} minutes</span>
                  </div>
                  <Slider
                    id="time-limit-minutes"
                    min={5}
                    max={60}
                    step={5}
                    value={[timeLimitMinutes]}
                    onValueChange={(value) => setTimeLimitMinutes(value[0])}
                    className="mt-2"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Setting a time limit can help improve focus and simulate exam conditions.
              </p>
            </div>
            
            <Separator />
            
            {/* Study Mode */}
            <div className="space-y-3">
              <Label>Study Mode</Label>
              <RadioGroup
                value={studyMode}
                onValueChange={setStudyMode}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="spaced-repetition"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                    studyMode === 'spaced-repetition' ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem
                    value="spaced-repetition"
                    id="spaced-repetition"
                    className="sr-only"
                  />
                  <Zap className="mb-2 h-6 w-6" />
                  <div className="text-center">
                    <span className="font-medium">Spaced Repetition</span>
                    <p className="text-xs text-muted-foreground">
                      Focus on cards due for review today
                    </p>
                  </div>
                </Label>
                
                <Label
                  htmlFor="new-cards"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                    studyMode === 'new-cards' ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem
                    value="new-cards"
                    id="new-cards"
                    className="sr-only"
                  />
                  <BookOpen className="mb-2 h-6 w-6" />
                  <div className="text-center">
                    <span className="font-medium">New Cards</span>
                    <p className="text-xs text-muted-foreground">
                      Focus on learning new material
                    </p>
                  </div>
                </Label>
                
                <Label
                  htmlFor="mixed"
                  className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                    studyMode === 'mixed' ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem
                    value="mixed"
                    id="mixed"
                    className="sr-only"
                  />
                  <BarChart className="mb-2 h-6 w-6" />
                  <div className="text-center">
                    <span className="font-medium">Mixed</span>
                    <p className="text-xs text-muted-foreground">
                      Combination of new and review cards
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
            
            <Separator />
            
            {/* Topics Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-all-topics">Include All Topics</Label>
                <Switch
                  id="include-all-topics"
                  checked={includeAllTopics}
                  onCheckedChange={(checked) => {
                    setIncludeAllTopics(checked);
                    if (checked) {
                      setSelectedTopics(module.topics);
                    }
                  }}
                />
              </div>
              
              {!includeAllTopics && (
                <div className="mt-4 space-y-2">
                  <Label>Select Topics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    {module.topics.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`topic-${topic}`}
                          className="rounded text-primary focus:ring-primary"
                          checked={selectedTopics.includes(topic)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTopics([...selectedTopics, topic]);
                            } else {
                              setSelectedTopics(selectedTopics.filter(t => t !== topic));
                            }
                          }}
                        />
                        <Label htmlFor={`topic-${topic}`} className="cursor-pointer">
                          {topic}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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