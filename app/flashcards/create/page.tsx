import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FlashcardForm } from "../../components/flashcards/temp-flashcard-form";

interface PageProps {
  searchParams: Promise<{ moduleId?: string; subModuleId?: string }>; // ✅ Fix: Ensure searchParams is awaited
}

// ✅ Fix: Await `searchParams` inside `generateMetadata`
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams; // ✅ Await `searchParams` before using it
  const moduleId = resolvedSearchParams.moduleId || "unknown";

  return {
    title: `Create Flashcards - Module ${moduleId}`,
  };
}

// ✅ Fix: Await `searchParams` inside `processSearchParams`
async function processSearchParams(searchParams: Promise<{ moduleId?: string; subModuleId?: string }>, userId: string) {
  const resolvedSearchParams = await searchParams; // ✅ Await searchParams before using

  const moduleId = resolvedSearchParams.moduleId || undefined;
  const subModuleId = resolvedSearchParams.subModuleId || undefined;

  if (!moduleId) {
    redirect("/study");
  }

  // ✅ Ensure module exists and user has access
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { subModules: true },
  });

  if (!module) {
    redirect("/study");
  }

  return { moduleId, subModuleId, module };
}

// ✅ Fix: Await `searchParams` inside `page.tsx` component
export default async function FlashcardCreatePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams; // ✅ Await searchParams before using it
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { moduleId, subModuleId, module } = await processSearchParams(searchParams, session.user.id);

  return (
    <div className="container py-8">
      <Link href="/study" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        Back to Study
      </Link>

      <h1 className="text-3xl font-bold mb-2">Create Flashcards</h1>
      <p className="text-muted-foreground mb-8">
        Add new flashcards for <strong>Module {module.number}: {module.title}</strong>
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Create Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          <FlashcardForm
            userId={session.user.id}
            preselectedModuleId={moduleId}
            preselectedSubModuleId={subModuleId} // ✅ No TypeScript error
            modules={[module]}
            currentModule={module}
          />
        </CardContent>
      </Card>
    </div>
  );
}
