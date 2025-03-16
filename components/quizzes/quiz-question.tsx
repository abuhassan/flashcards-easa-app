import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type Option = {
  id: string;
  text: string;
};

type QuizQuestionProps = {
  id: string;
  number: number;
  text: string;
  options: Option[];
  userAnswer?: string;
  isFlagged?: boolean;
  onAnswerChange: (data: { questionId: string, answer: string }) => void;
  onFlagChange: (data: { questionId: string, flagged: boolean }) => void;
  onNavigate: (direction: 'next' | 'previous') => void;
  isFirst: boolean;
  isLast: boolean;
  isReview?: boolean;
  correctAnswer?: string;
  explanation?: string;
};

export default function QuizQuestion({
  id,
  number,
  text,
  options,
  userAnswer = "",
  isFlagged = false,
  onAnswerChange,
  onFlagChange,
  onNavigate,
  isFirst,
  isLast,
  isReview = false,
  correctAnswer,
  explanation,
}: QuizQuestionProps) {
  console.log("QuizQuestion rendered with props:", { 
    id, 
    number, 
    textLength: text?.length, 
    optionsCount: options?.length,
    onNavigateType: typeof onNavigate 
  });

  // Initialize state
  const [selectedOption, setSelectedOption] = useState<string>(userAnswer);
  const [flagged, setFlagged] = useState<boolean>(isFlagged);
  
  // Update state when props change
  useEffect(() => {
    if (userAnswer !== selectedOption) {
      setSelectedOption(userAnswer);
    }
    
    if (isFlagged !== flagged) {
      setFlagged(isFlagged);
    }
  }, [userAnswer, isFlagged, selectedOption, flagged]);

  const handleOptionChange = (value: string) => {
    console.log("Option selected:", value);
    setSelectedOption(value);
    try {
      onAnswerChange({ questionId: id, answer: value });
    } catch (error) {
      console.error("Error in onAnswerChange:", error);
      toast.error("Failed to save your answer");
    }
  };

  const handleFlag = () => {
    const newFlaggedState = !flagged;
    console.log("Flag toggled:", newFlaggedState);
    setFlagged(newFlaggedState);
    try {
      onFlagChange({ questionId: id, flagged: newFlaggedState });
    } catch (error) {
      console.error("Error in onFlagChange:", error);
      toast.error("Failed to update flag status");
    }
  };

  // Safe wrapper for navigation function
  const safeNavigate = (direction: 'next' | 'previous') => {
    console.log("safeNavigate called with:", direction, typeof onNavigate);
    try {
      if (typeof onNavigate === 'function') {
        onNavigate(direction);
      } else {
        console.error("onNavigate is not a function:", onNavigate);
        toast.error("Navigation error - please try again");
      }
    } catch (error) {
      console.error("Error during navigation:", error);
      toast.error("Navigation failed");
    }
  };

  // Determine if the selected answer is correct (only in review mode)
  const isCorrect = isReview && selectedOption === correctAnswer;
  const isIncorrect = isReview && selectedOption && selectedOption !== correctAnswer;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Question {number}</CardTitle>
        <Button
          variant={flagged ? "default" : "outline"}
          size="sm"
          onClick={handleFlag}
          className={flagged ? "bg-yellow-500 hover:bg-yellow-600" : ""}
        >
          <Flag className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">
            {flagged ? "Flagged" : "Flag"}
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-base font-medium mb-4">{text}</p>
          {options && options.length > 0 ? (
            <RadioGroup value={selectedOption} onValueChange={handleOptionChange} className="space-y-3">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 p-3 border rounded-md ${
                    isReview && option.id === correctAnswer 
                      ? "border-green-500 bg-green-50" 
                      : isReview && option.id === selectedOption && option.id !== correctAnswer 
                        ? "border-red-500 bg-red-50" 
                        : !isReview && option.id === selectedOption 
                          ? "border-blue-500 bg-blue-50" 
                          : ""
                  }`}
                >
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} disabled={isReview} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No options available for this question
            </div>
          )}
        </div>

        {/* Explanation (only shown in review mode) */}
        {isReview && explanation && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border">
            <p className="font-medium mb-1">Explanation:</p>
            <p className="text-sm">{explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => safeNavigate('previous')}
          disabled={isFirst}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={() => safeNavigate('next')}
          disabled={!selectedOption && !isReview}
        >
          {isLast ? "Finish" : "Next"}
          {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </CardFooter>
    </Card>
  );
}