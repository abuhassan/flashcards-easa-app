import Link from "next/link";
import { quizData } from "@/lib/data/quiz-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuizzesPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Quizzes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizData.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <Link href={`/dashboard/quizzes/${quiz.id}`}>
                <Button>Start Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
