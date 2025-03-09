// app/dashboard/modules/[moduleId]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Module Details | EASA Flashcards",
  description: "View module details and flashcards",
};

// Sample module data - replace with your database fetch
const moduleData = {
  'module-1': { 
    number: 1, 
    title: 'Mathematics', 
    description: 'Arithmetic, algebra, geometry and basic trigonometry.',
    topics: ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry']
  },
  'module-3': { 
    number: 3, 
    title: 'Basic Electricity', 
    description: 'Electron theory, static electricity, and electrical terminology.',
    topics: ['Electron Theory', 'Static Electricity', 'Electrical Terminology']
  },
  // Add other modules
};

// Use this pattern for an async component
export default async function ModuleDetailPage({ params }: { params: { moduleId: string } }) {
  // Properly destructure params
  const { moduleId } = await Promise.resolve(params);
  
  const module = moduleData[moduleId as keyof typeof moduleData];
  
  if (!module) {
    return <div>Module not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Module {module.number}: {module.title}</h1>
        <Button asChild>
          <Link href={`/dashboard/study/${moduleId}`}>Study Now</Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground">{module.description}</p>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.topics.map((topic) => (
            <Card key={topic}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{topic}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/study/${moduleId}?topic=${encodeURIComponent(topic)}`}>
                    Study This Topic
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}