// app/dashboard/quizzes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import QuizList from "@/components/quizzes/quiz-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import { getQuizzes, getQuizHistory } from "@/app/actions/quiz-actions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Quiz, 
  QuizAttempt, 
  safelyMapQuizzes, 
  safelyMapQuizAttempts 
} from "@/types/quiz";
import { toast } from "sonner";

export default function QuizzesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tab, setTab] = useState("available");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch quizzes
        const quizzesResponse = await getQuizzes({
          search: searchTerm,
          difficulty: difficultyFilter,
        });
        
        if (quizzesResponse.success && quizzesResponse.quizzes) {
          // Use the mapping function to ensure type compatibility
          setQuizzes(safelyMapQuizzes(quizzesResponse.quizzes));
        } else if (!quizzesResponse.success) {
          toast.error(quizzesResponse.error || "Failed to fetch quizzes");
        }
        
        // Fetch quiz history
        const historyResponse = await getQuizHistory();
        if (historyResponse.success && historyResponse.data) {
          // Use the mapping function to ensure type compatibility
          setHistory(safelyMapQuizAttempts(historyResponse.data));
        } else if (!historyResponse.success) {
          toast.error(historyResponse.error || "Failed to fetch quiz history");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchTerm, difficultyFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
  };

  const handleCreateQuiz = () => {
    router.push("/dashboard/quizzes/create");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <Button onClick={handleCreateQuiz}>
          <Plus className="h-4 w-4 mr-2" /> Create Quiz
        </Button>
      </div>

      <Tabs defaultValue="available" value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Quizzes</TabsTrigger>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Quizzes</CardTitle>
              <CardDescription>
                Test your knowledge with these quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="md:w-1/2"
                />
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
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <QuizList quizzes={quizzes} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>
                Review your quiz attempts and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't completed any quizzes yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setTab("available")}
                  >
                    Browse Available Quizzes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((attempt) => (
                    <Card key={attempt.id} className="overflow-hidden">
                      <div className={`h-2 ${attempt.isPassed ? "bg-green-500" : "bg-red-500"}`} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{attempt.quizTitle}</h3>
                            <p className="text-sm text-gray-500">
                              Module {attempt.moduleNumber}: {attempt.moduleName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{attempt.score?.toFixed(1)}%</p>
                            <p className="text-sm text-gray-500">
                              {attempt.completedAt && new Date(attempt.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => router.push(`/dashboard/quizzes/results/${attempt.id}`)}
                          >
                            View Results
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}