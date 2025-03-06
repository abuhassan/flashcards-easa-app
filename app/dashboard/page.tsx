// app/dashboard/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ModuleOverview } from "../components/dashboard/module-overview";
import { StudyReminder } from "../components/dashboard/study-reminder";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Zap, Plus, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | EASA Flashcards",
  description: "Track your learning progress for EASA Part 66 modules",
};

// Mock data for initial MVP - replace with real data from your database
const priorityModules = [
  { 
    id: "module-1", 
    number: 1, 
    title: "Mathematics", 
    progress: 25, 
    cardCount: 120,
    lastStudied: "2 days ago"
  },
  { 
    id: "module-3", 
    number: 3, 
    title: "Basic Electricity", 
    progress: 45, 
    cardCount: 150,
    lastStudied: "Yesterday"
  },
  { 
    id: "module-4", 
    number: 4, 
    title: "Basic Electronics", 
    progress: 10, 
    cardCount: 130,
    lastStudied: "5 days ago"
  },
  { 
    id: "module-8", 
    number: 8, 
    title: "Basic Aerodynamics", 
    progress: 0, 
    cardCount: 100,
    lastStudied: "Not started"
  },
];

const recentActivity = [
  { id: "session-1", module: "Basic Electricity", date: "Yesterday", duration: "25 min", score: "Good" },
  { id: "session-2", module: "Mathematics", date: "2 days ago", duration: "15 min", score: "Excellent" },
];

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/sign-in"); // Consistent with your authentication paths
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Learning Dashboard</h1>
        <p className="text-muted-foreground">Track your EASA Part 66 exam preparation</p>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 40m</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flashcards Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mastery Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beginner</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Modules */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Priority Modules</CardTitle>
              <CardDescription>Focus on these modules for your EASA exam preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityModules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium truncate">
                          Module {module.number}: {module.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {module.lastStudied}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {module.progress}% complete
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {module.cardCount} cards
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/study/${module.id}`}>
                        <Zap className="h-4 w-4 mr-1" />
                        Study
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link href="/dashboard/modules">
                  View All Modules
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest study sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium">{activity.module}</p>
                        <div className="flex text-xs text-muted-foreground">
                          <span>{activity.date}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.duration}</span>
                          <span className="mx-1">•</span>
                          <span>Performance: {activity.score}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recent study sessions. Start studying to track your progress!</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="default" className="ml-auto" asChild>
                <Link href="/dashboard/study">
                  <Plus className="mr-2 h-4 w-4" />
                  New Study Session
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Study Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <StudyReminder userName={session.user.name || "there"} />
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/dashboard/study">
                  Start Studying
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/flashcards/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Flashcard
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/study">
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Study Session
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/modules">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse All Modules
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}