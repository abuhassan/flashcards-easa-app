'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveFlashcard, FlashcardFormData } from '../actions';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// EASA Part 66 modules
const EASA_MODULES = [
  { id: '1', name: 'Mathematics' },
  { id: '2', name: 'Physics' },
  { id: '3', name: 'Electrical Fundamentals' },
  { id: '4', name: 'Electronic Fundamentals' },
  { id: '5', name: 'Digital Techniques / Electronic Instrument Systems' },
  { id: '6', name: 'Materials and Hardware' },
  { id: '7', name: 'Maintenance Practices' },
  { id: '8', name: 'Basic Aerodynamics' },
  { id: '9', name: 'Human Factors' },
  { id: '10', name: 'Aviation Legislation' },
  { id: '11', name: 'Aeroplane Aerodynamics, Structures and Systems' },
  { id: '12', name: 'Helicopter Aerodynamics, Structures and Systems' },
  { id: '13', name: 'Aircraft Aerodynamics, Structures and Systems' },
  { id: '14', name: 'Propulsion' },
  { id: '15', name: 'Gas Turbine Engine' },
  { id: '16', name: 'Piston Engine' },
  { id: '17', name: 'Propeller' },
];

interface FlashcardFormProps {
  initialData?: FlashcardFormData;
}

export default function FlashcardForm({ initialData }: FlashcardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FlashcardFormData>(
    initialData || {
      question: '',
      answer: '',
      module: '',
      subModule: '',
      difficulty: 'medium',
      tags: [],
    }
  );
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FlashcardFormData) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: FlashcardFormData) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev: FlashcardFormData) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: FlashcardFormData) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove),
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await saveFlashcard(formData);
      
      if (result.success) {
        toast.success(initialData ? 'Flashcard updated successfully' : 'Flashcard created successfully');
        router.push('/dashboard/flashcards');
        router.refresh();
      } else {
        setError(result.error || 'Failed to save flashcard');
        toast.error(result.error || 'Failed to save flashcard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('Failed to save flashcard');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Flashcard' : 'Create New Flashcard'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module">EASA Module</Label>
            <Select 
              value={formData.module}
              onValueChange={(value) => handleSelectChange('module', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {EASA_MODULES.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    Module {module.id}: {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subModule">Sub-Module (Optional)</Label>
            <Input
              id="subModule"
              name="subModule"
              value={formData.subModule || ''}
              onChange={handleChange}
              placeholder="e.g. 10.5 - Certification of Aircraft"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter your question here"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter the answer here"
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select 
              value={formData.difficulty}
              onValueChange={(value) => handleSelectChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-destructive rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove tag</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-sm font-medium text-destructive">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
              ? 'Update Flashcard'
              : 'Create Flashcard'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}