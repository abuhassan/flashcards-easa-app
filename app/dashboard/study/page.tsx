// app/dashboard/study/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Study | EASA Flashcards",
  description: "Start your EASA Part 66 study session",
};

// Sample module data for the MVP
const priorityModules = [
  { 
    id: 'module-1', 
    number: 1, 
    title: 'Mathematics', 
    progress: 25, 
    cardCount: 120,
    dueCards: 45,
    lastStudied: '2 days ago'
  },
  { 
    id: 'module-3', 
    number: 3, 
    title: 'Basic Electricity', 
    progress: 45, 
    cardCount: 150,
    dueCards: 60,
    lastStudied: 'Yesterday'
  },
  { 
    id: 'module-4', 
    number: 4, 
    title: 'Basic Electronics', 
    progress: 10, 
    cardCount: 130,
    dueCards: 80,
    lastStudied: '5 days ago'
  },
  { 
    id: 'module-8', 
    number: 8, 
    title: 'Basic Aerodynamics', 
    progress: 0, 
    cardCount: 100,
    dueCards: 100,
    lastStudied: 'Not started'
  },
];

export default async function StudyPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/sign-in");
  }
  
  // Get cards due for review across all modules
  const totalDueCards = priorityModules.reduce((sum, module) => sum + module.dueCards, 0);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Session</h1>
        <p className="text-muted-foreground">Start a new study session or review cards due for practice</p>
      </div>
      
      {/* Quick Study Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Quick Study
          </CardTitle>
          <CardDescription>
            You have {totalDueCards} cards due for review today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Start a quick study session with cards from all modules that are due for review.
            This is the most efficient way to study using the spaced repetition system.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/dashboard/study/session?mode=due">
              Start Quick Study
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Module Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Study by Module</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityModules.map((module) => (
            <Card key={module.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>Module {module.number}: {module.title}</span>
                  {module.progress > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">{module.progress}%</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Cards: </span>
                    <span className="font-medium">{module.cardCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due: </span>
                    <span className="font-medium">{module.dueCards}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last studied: </span>
                    <span className="font-medium">{module.lastStudied}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/study/${module.id}`}>
                    Study this module
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Study Methods */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Study Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm pb-4">
              View all available EASA Part 66 modules and select specific topics to study.
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/dashboard/modules">Browse Modules</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Difficult Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm pb-4">
              Focus on cards you've previously marked as difficult to improve your weak areas.
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/dashboard/study/session?mode=difficult">Study Difficult Cards</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Timed Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm pb-4">
              Test your knowledge under time pressure with a timed study session.
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/dashboard/study/session?mode=timed">Start Timed Challenge</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}