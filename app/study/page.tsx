import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUserModules } from "@/app/actions/module-actions";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study | EASA Flashcards",
  description: "Study your EASA Part 66 modules",
};

export default async function StudyPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Get user's modules
  const userModules = await getCurrentUserModules();
  
  // If no modules are selected, redirect to module selection
  if (userModules.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Study Session</h1>
        
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <p className="mb-4">You haven't selected any modules to study yet.</p>
              <Link href="/modules">
                <Button>Select modules to study</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Study Session</h1>
      <p className="text-muted-foreground mb-8">Choose a module to study</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userModules.map((userModule) => (
          <Link 
            key={userModule.id}
            href={`/study/${userModule.moduleId}`}
            className="block"
          >
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">
                  Module {userModule.module.number}: {userModule.module.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {userModule.module.description || `Study materials for Module ${userModule.module.number}`}
                </p>
                <div className="text-xs text-muted-foreground">
                  {userModule.module.subModules.length} submodules • 0% completed
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}