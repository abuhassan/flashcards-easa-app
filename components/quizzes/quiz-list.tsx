// components/quizzes/quiz-list.tsx
"use client";

import { useState } from "react";
import QuizCard from "./quiz-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Quiz } from "@/types/quiz"; // Import the Quiz type from shared types

type QuizListProps = {
  quizzes: Quiz[];
};

export default function QuizList({ quizzes }: QuizListProps) {
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizzes);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  // Get unique modules
  const modules = [...new Set(quizzes.map(quiz => quiz.moduleId))].map(moduleId => {
    const quiz = quizzes.find(q => q.moduleId === moduleId);
    return {
      id: moduleId,
      title: quiz?.module.title || "",
      number: quiz?.module.number || ""
    };
  });

  // Filter quizzes based on search and filters
  const filterQuizzes = () => {
    return quizzes.filter(quiz => {
      // Search term filter
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Difficulty filter
      const matchesDifficulty = !difficultyFilter || quiz.difficulty === difficultyFilter;
      
      // Module filter
      const matchesModule = !moduleFilter || quiz.moduleId === moduleFilter;
      
      return matchesSearch && matchesDifficulty && matchesModule;
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilteredQuizzes(filterQuizzes());
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setFilteredQuizzes(filterQuizzes());
  };

  // Handle module filter change
  const handleModuleChange = (value: string) => {
    setModuleFilter(value);
    setFilteredQuizzes(filterQuizzes());
  };

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No quizzes available yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="md:w-1/2"
        />
        <div className="flex gap-4">
          <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={moduleFilter} onValueChange={handleModuleChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((module, index) => (
                <SelectItem key={module.id || `module-${index}`} value={module.id || `default-${index}`}>
                  Module {module.number}: {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quiz cards */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No quizzes match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              description={quiz.description || undefined} // Convert null to undefined
              moduleNumber={quiz.module.number}
              moduleName={quiz.module.title}
              questionCount={quiz.totalQuestions}
              timeLimit={quiz.timeLimit || undefined} // Convert null to undefined
              difficulty={quiz.difficulty}
            />
          ))}
        </div>
      )}
    </div>
  );
}