// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Brain, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Master EASA Part 66 with Smart Flashcards
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Accelerate your learning with our advanced flashcard system. Study smarter, not harder.
            </p>
            <div className="space-x-4">
              <Link href="/sign-in">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Brain className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Smart Learning</CardTitle>
                <CardDescription>
                  Adaptive spaced repetition system that optimizes your study schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                Focus on what you need to learn most, with AI-powered study recommendations
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Comprehensive Content</CardTitle>
                <CardDescription>
                  Complete coverage of EASA Part 66 modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                Study materials aligned with the latest EASA requirements and standards
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-12 h-12 mb-4 text-primary" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                Get insights into your study patterns and improvement areas
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}