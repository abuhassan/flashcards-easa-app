// components/flashcards/flashcard-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createFlashcard } from "../../actions/flashcard-actions";

// Add this interface at the top of your file
interface SubModule {
    id: string;
    number: string;
    title: string;
    moduleId: string;
  }


// Define form schema
const formSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(3, "Answer must be at least 3 characters"),
  moduleId: z.string().min(1, "Module is required"),
  subModuleId: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.string().optional(),
});

type FlashcardFormValues = z.infer<typeof formSchema>;

interface FlashcardFormProps {
  userId: string;
  preselectedModuleId?: string;
  preselectedSubModuleId?: string;
  modules: any[];
  currentModule?: any;
}

export function FlashcardForm({
  userId,
  preselectedModuleId,
  preselectedSubModuleId,
  modules,
  currentModule,
}: FlashcardFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form with default values
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      moduleId: preselectedModuleId || "",
      subModuleId: preselectedSubModuleId || "",
      difficulty: "medium",
      tags: "",
    },
  });

  // Get values from form
  const { watch, setValue } = form;
  const selectedModuleId = watch("moduleId");

  // Get submodules for the selected module
  const selectedModule = 
    selectedModuleId === preselectedModuleId
      ? currentModule
      : modules.find((m) => m.id === selectedModuleId);
  
  const subModules = selectedModule?.subModules || [];

  // Handle module change to reset submodule if needed
  const handleModuleChange = (value: string) => {
    setValue("moduleId", value);
    setValue("subModuleId", "");
  };

  // Handle form submission
  const onSubmit = async (data: FlashcardFormValues) => {
    try {
      setIsSubmitting(true);

      // Process tags into array
      const tagArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      // Submit to server action
      await createFlashcard({
        ...data,
        tags: tagArray,
        userId,
      });

      toast.success("Flashcard created successfully!");
      
      // Navigate back or reset form
      if (preselectedModuleId) {
        router.push(`/study/${preselectedModuleId}`);
      } else {
        form.reset();
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error creating flashcard:", error);
      toast.error("Failed to create flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Module Selection */}
            <FormField
              control={form.control}
              name="moduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module</FormLabel>
                  <Select
                    disabled={!!preselectedModuleId}
                    onValueChange={handleModuleChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {preselectedModuleId && currentModule ? (
                        <SelectItem value={currentModule.id}>
                          Module {currentModule.number}: {currentModule.title}
                        </SelectItem>
                      ) : (
                        modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            Module {module.number}: {module.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submodule Selection */}
            {(selectedModuleId || preselectedModuleId) && subModules.length > 0 && (
              <FormField
                control={form.control}
                name="subModuleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Submodule (Optional)</FormLabel>
                    <Select
                      disabled={!!preselectedSubModuleId}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select submodule (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {subModules.map((submodule: SubModule) => (
                        <SelectItem key={submodule.id} value={submodule.id}>
                            {submodule.number}: {submodule.title}
                        </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the answer"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hydraulics, electrical, theory"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Flashcard"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}