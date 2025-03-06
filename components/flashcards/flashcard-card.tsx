// components/flashcards/flashcard-card.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, Volume2, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FlashcardProps = {
  id: string;
  question: string;
  answer: string;
  module: {
    id: string;
    title: string;
    number: string;
  };
  difficulty: string;
  tags: string[];
  userProgress?: {
    confidenceLevel?: number;
    isLearned?: boolean;
    isFavorite?: boolean;
  };
  onUpdate?: (id: string, data: any) => void;
};

export default function FlashcardCard({
  id,
  question,
  answer,
  module,
  difficulty,
  tags,
  userProgress,
  onUpdate,
}: FlashcardProps) {
  const { data: session } = useSession();
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(userProgress?.confidenceLevel || 0);
  const [isFavorite, setIsFavorite] = useState(userProgress?.isFavorite || false);

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Text-to-speech function
  const speakContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = isFlipped ? answer : question;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle confidence rating
  const handleConfidenceRating = async (level: number) => {
    setConfidenceLevel(level);
    
    if (session && onUpdate) {
      try {
        // In a real implementation, you would call your API here
        // await updateFlashcardProgress(id, { confidenceLevel: level });
        onUpdate(id, { confidenceLevel: level });
      } catch (error) {
        console.error("Error updating confidence level:", error);
      }
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (session && onUpdate) {
      try {
        // In a real implementation, you would call your API here
        // await updateFlashcardProgress(id, { isFavorite: newFavoriteState });
        onUpdate(id, { isFavorite: newFavoriteState });
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    }
  };

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      {/* Difficulty and module badges */}
      <div className="flex justify-between items-center mb-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
          Module {module.number}: {module.title}
        </Badge>
        <Badge variant="outline" className={getDifficultyColor()}>
          {difficulty}
        </Badge>
      </div>

      {/* Main flashcard */}
      <Card
        className={cn(
          "w-full h-48 cursor-pointer relative shadow-md hover:shadow-lg transition-all duration-300",
          isFlipped ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800"
        )}
        onClick={handleFlip}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-medium mb-2 text-center">
              {!isFlipped ? "Question" : "Answer"}
            </h3>
            <div className="text-center overflow-auto">
              {!isFlipped ? question : answer}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={speakContent}>
              <Volume2 className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">Audio</span>
            </Button>
            
            {session && (
              <Button
                variant={isFavorite ? "default" : "ghost"}
                size="sm"
                onClick={(e) => handleFavoriteToggle(e)}
              >
                {isFavorite ? (
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-1" />
                )}
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  {isFavorite ? "Saved" : "Save"}
                </span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confidence rating */}
      {session && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">How well do you know this?</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={confidenceLevel >= level ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => handleConfidenceRating(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}