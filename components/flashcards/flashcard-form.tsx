// components/flashcards/flashcard-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";

// Define types for the module data
interface SubModule {
  id: string;
  number: string;
  title: string;
}

interface Module {
  id: string;
  number: string;
  title: string;
  subModules: SubModule[];
}

// Define form schema and types
const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  moduleId: z.string().min(1, "Module is required"),
  subModuleId: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InitialData {
  question?: string;
  answer?: string;
  moduleId?: string;
  subModuleId?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

interface FlashcardFormProps {
  initialData?: InitialData | null;
}

// Sample modules data (would come from your API in a real app)
const modules: Module[] = [
  {
    id: "module-3",
    number: "3",
    title: "Basic Electrical Knowledge",
    subModules: [
      { id: "mod3-topic1", number: "3.1", title: "Electron Theory" },
      { id: "mod3-topic2", number: "3.2", title: "Static Electricity" },
    ],
  },
  {
    id: "module-4",
    number: "4",
    title: "Basic Electronics",
    subModules: [
      { id: "mod4-topic1", number: "4.1", title: "Semiconductors" },
      { id: "mod4-topic2", number: "4.2", title: "Diodes" },
    ],
  },
  {
    id: "module-8",
    number: "8",
    title: "Basic Aerodynamics",
    subModules: [
      { id: "mod8-topic1", number: "8.1", title: "Physics of the Atmosphere" },
      { id: "mod8-topic2", number: "8.2", title: "Aerodynamics" },
    ],
  },
];

export default function FlashcardForm({ initialData = null }: FlashcardFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(initialData?.moduleId || "");
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
      moduleId: initialData?.moduleId || "",
      subModuleId: initialData?.subModuleId || "",
      difficulty: initialData?.difficulty || "medium",
      tags: initialData?.tags || [],
    },
  });

  // Handle module change to update submodules
  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    form.setValue("moduleId", moduleId);
    form.setValue("subModuleId", "");

    const selectedModule = modules.find((m) => m.id === moduleId);
    setSubModules(selectedModule?.subModules || []);
  };

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!tags.includes(tagInput)) {
        const newTags = [...tags, tagInput];
        setTags(newTags);
        form.setValue("tags", newTags);
      }
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  // Add a tag with button
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  // Form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your API here
      console.log("Submitting data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect to flashcards list
      router.push("/dashboard/flashcards");
      router.refresh();
    } catch (error) {
      console.error("Error creating flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Flashcard" : "Create New Flashcard"}</CardTitle>
        <CardDescription>
          {initialData
            ? "Update your existing flashcard"
            : "Add a new flashcard to your collection"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Field */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question here..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer Field */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the answer here..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Module Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="moduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <Select
                      onValueChange={handleModuleChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a module" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            Module {module.number}: {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sub-module Field */}
              <FormField
                control={form.control}
                name="subModuleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-module</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedModuleId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sub-module" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subModules.map((subModule) => (
                          <SelectItem key={subModule.id} value={subModule.id}>
                            {subModule.number}: {subModule.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Difficulty Field */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Field */}
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!tagInput}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                Press Enter to add each tag. Tags help categorize your flashcards.
              </FormDescription>

              {/* Display tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </FormItem>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Flashcard" : "Create Flashcard"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}