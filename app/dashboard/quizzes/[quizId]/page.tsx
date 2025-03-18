"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { quizData } from "@/lib/data/quiz-data";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const { quizId } = useParams();
  const quiz = quizData.find((q) => q.id === quizId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) {
    return <p className="text-red-500">Quiz not found</p>;
  }

  const question = quiz.questions[currentQuestion];

  const handleNext = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      {isFinished ? (
        <div>
          <p className="text-lg font-semibold">Quiz Completed!</p>
          <p className="text-gray-600">Your Score: {score} / {quiz.questions.length}</p>
          <Button asChild>
            <a href="/dashboard/quizzes">Back to Quizzes</a>
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold">{question.question}</p>
          <div className="space-y-2 mt-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`block w-full text-left px-4 py-2 border rounded ${
                  selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <Button className="mt-4" onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestion + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  );
}
