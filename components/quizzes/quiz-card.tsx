// components/quizzes/quiz-card.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

type QuizCardProps = {
  id: string;
  title: string;
  description?: string;  // Changed to optional string instead of string | null
  moduleNumber: string;
  moduleName: string;
  questionCount: number;
  timeLimit?: number;    // Changed to optional number instead of number | null
  difficulty: string;
};

export default function QuizCard({
  id,
  title,
  description,
  moduleNumber,
  moduleName,
  questionCount,
  timeLimit,
  difficulty,
}: QuizCardProps) {
  const router = useRouter();

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStartQuiz = () => {
    router.push(`/dashboard/quizzes/${id}`);
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 mt-1">
          Module {moduleNumber}: {moduleName}
        </Badge>
      </CardHeader>
      <CardContent className="pb-4">
        {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{questionCount} questions</span>
          </div>
          {timeLimit && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{timeLimit} minutes</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={handleStartQuiz} className="w-full">
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}