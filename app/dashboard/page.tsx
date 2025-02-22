// app/dashboard/page.tsx
import { auth } from "../../auth/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getDashboardStats } from "@/lib/dashboard"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { BookOpen, Brain, Target, Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/sign-in')
  }

  const stats = await getDashboardStats(session.user.id)
  const progressPercentage = (stats.todayProgress / 30) * 100 // Assuming daily goal of 30
  const timeToNextReview = stats.nextReview 
    ? formatDistanceToNow(stats.nextReview)
    : 'No reviews due'

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}</h1>
          <p className="text-muted-foreground">Here's your learning progress</p>
        </div>
        <Button asChild>
          <Link href="/flashcards/study">Start Studying</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayProgress}/30</div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays} Days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Mastered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.masteredCards}</div>
            <p className="text-xs text-muted-foreground">Out of {stats.totalCards} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeToNextReview}</div>
            <p className="text-xs text-muted-foreground">{stats.dueCards} cards due</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Reviewed {activity.flashcard.module} - {activity.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.updatedAt)} ago
                  </p>
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}