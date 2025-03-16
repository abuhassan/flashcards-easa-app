'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import QuizQuestion from './quiz-question';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getQuizQuestions, submitQuizAnswer, flagQuizQuestion, completeQuizAttempt } from '@/app/actions/quiz-actions';

type QuizWrapperProps = {
  attemptId: string;
  quizId: string;
};

export default function QuizWrapper({ attemptId, quizId }: QuizWrapperProps) {
  console.log("QuizWrapper initialized with", { attemptId, quizId });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all questions for this quiz attempt
  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("Fetching questions for attemptId:", attemptId);
      setIsLoading(true);
      try {
        // Call getQuizQuestions with the attemptId
        const response = await getQuizQuestions(attemptId);
        console.log("Response from getQuizQuestions:", response);
        
        if (response.success && response.data) {
          // Set questions from the response data array
          if (Array.isArray(response.data)) {
            console.log("Setting questions from array:", response.data.length);
            setQuestions(response.data);
          } else {
            console.error("Unexpected data format from getQuizQuestions", response.data);
            setError("Unexpected data format from server");
            toast.error("Unexpected data format from server");
          }
        } else {
          console.error("Failed response from getQuizQuestions:", response.error);
          setError(response.error || "Failed to load quiz questions");
          toast.error(response.error || "Failed to load quiz questions");
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setError("An error occurred while loading the quiz");
        toast.error("An error occurred while loading the quiz");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [attemptId]);

  // Log state changes for debugging
  useEffect(() => {
    console.log("Questions state updated:", {
      count: questions.length,
      currentIndex: currentQuestionIndex,
      hasCurrentQuestion: currentQuestionIndex < questions.length && currentQuestionIndex >= 0
    });
  }, [questions, currentQuestionIndex]);

  // Define handlers
  const handleAnswerChange = async (data: { questionId: string; answer: string }) => {
    console.log("Answer changed:", data);
    // Find the question in our state and update it
    const updatedQuestions = questions.map(q => 
      q.id === data.questionId 
        ? { ...q, userAnswer: data.answer } 
        : q
    );
    setQuestions(updatedQuestions);
    
    // Submit the answer to the server
    try {
      await submitQuizAnswer({
        attemptId,
        questionId: data.questionId,
        answer: data.answer
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to save your answer. Please try again.");
    }
  };

  const handleFlagChange = async (data: { questionId: string; flagged: boolean }) => {
    console.log("Flag changed:", data);
    // Find the question in our state and update it
    const updatedQuestions = questions.map(q => 
      q.id === data.questionId 
        ? { ...q, isFlagged: data.flagged } 
        : q
    );
    setQuestions(updatedQuestions);
    
    // Submit the flag change to the server
    try {
      await flagQuizQuestion({
        attemptId,
        questionId: data.questionId,
        flagged: data.flagged
      });
    } catch (error) {
      console.error("Error updating flag:", error);
      toast.error("Failed to update flag status. Please try again.");
    }
  };

  const handleNavigate = (direction: 'next' | 'previous') => {
    console.log("Navigation called with direction:", direction);
    
    // Calculate new index
    const newIndex = direction === 'next' 
      ? currentQuestionIndex + 1 
      : currentQuestionIndex - 1;
    
    console.log("New index calculated:", newIndex);
    
    // Check if we need to complete the quiz
    if (direction === 'next' && newIndex >= questions.length) {
      console.log("Reached end of questions, completing quiz");
      handleCompleteQuiz();
      return;
    }
    
    // Update the current question index
    if (newIndex >= 0 && newIndex < questions.length) {
      console.log("Setting new question index:", newIndex);
      setCurrentQuestionIndex(newIndex);
    } else {
      console.log("Invalid index, not navigating:", newIndex);
    }
  };

  const handleCompleteQuiz = async () => {
    console.log("Completing quiz");
    setIsSubmitting(true);
    try {
      // Use the server action to complete the quiz
      const response = await completeQuizAttempt(attemptId);
      
      if (response.success) {
        // Navigate to results page
        toast.success("Quiz completed successfully!");
        router.push(`/dashboard/quizzes/results/${attemptId}`);
      } else {
        toast.error(response.error || "Failed to complete quiz");
      }
    } catch (error) {
      console.error("Error completing quiz:", error);
      toast.error("An error occurred while completing the quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg mb-4">Error: {error}</p>
          <Button onClick={() => router.push("/dashboard/quizzes")}>
            Back to Quizzes
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Render empty state
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg mb-4">No questions available for this quiz</p>
          <Button onClick={() => router.push("/dashboard/quizzes")}>
            Back to Quizzes
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle missing current question
  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg mb-4">Question not found (index: {currentQuestionIndex})</p>
          <Button onClick={() => router.push("/dashboard/quizzes")}>
            Back to Quizzes
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Log what we're rendering
  console.log("Question data before rendering:", {
    id: currentQuestion.id,
    text: currentQuestion.text,
    options: currentQuestion.options,
    hasOptions: Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0
  });
  
  // Ensure options is always an array
  const options = Array.isArray(currentQuestion.options) ? 
    currentQuestion.options : [];
  
  return (
    <QuizQuestion
      id={currentQuestion.id}
      number={currentQuestionIndex + 1}
      text={currentQuestion.text || "No question text available"}
      options={options}
      userAnswer={currentQuestion.userAnswer}
      isFlagged={currentQuestion.isFlagged}
      onAnswerChange={handleAnswerChange}
      onFlagChange={handleFlagChange}
      onNavigate={handleNavigate}
      isFirst={currentQuestionIndex === 0}
      isLast={currentQuestionIndex === questions.length - 1}
      isReview={false}
    />
  );
}