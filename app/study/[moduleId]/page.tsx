import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ moduleId: string }>; // Ensure params is awaited
}

// ✅ Fix: Await `params` inside `generateMetadata`
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams?.moduleId) {
    return { title: "Study | EASA Flashcards" };
  }

  const module = await getModule(resolvedParams);

  return {
    title: module ? `Study Module ${module.number} | EASA Flashcards` : "Study | EASA Flashcards",
  };
}

// ✅ Fix: Await `params` inside `getModule`
async function getModule(params: { moduleId: string }) {
  return await prisma.module.findUnique({
    where: { id: params.moduleId },
  });
}

// ✅ Fix: Await `params` inside `getModuleData`
async function getModuleData(params: Promise<{ moduleId: string }>, userId: string) {
  const resolvedParams = await params;

  if (!resolvedParams?.moduleId) {
    notFound();
  }

  const module = await prisma.module.findUnique({
    where: { id: resolvedParams.moduleId },
    include: { subModules: true },
  });

  if (!module) {
    notFound();
  }

  const userModule = await prisma.userModule.findFirst({
    where: {
      userId: userId,
      moduleId: resolvedParams.moduleId,
      isActive: true,
    },
  });

  if (!userModule) {
    redirect("/study");
  }

  const flashcards = await prisma.flashcard.count({
    where: {
      moduleId: resolvedParams.moduleId,
      userId: userId,
    },
  });

  return { module, flashcards };
}

// ✅ Fix: Await `params` inside `page.tsx` component
export default async function ModuleStudyPage({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Await params before using
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { module, flashcards } = await getModuleData(params, session.user.id);

  return (
    <div className="container py-8">
      <Link href="/study" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Study
      </Link>

      <h1 className="text-3xl font-bold mb-2">Module {module.number}: {module.title}</h1>
      <p className="text-muted-foreground mb-8">{module.description}</p>

      {flashcards > 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Studying</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You have {flashcards} flashcards in this module.</p>
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <Button>Review All Cards</Button>
                <Button variant="outline">Practice Difficult Cards</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="mb-4">You don't have any flashcards in this module yet.</p>
              <CreateFlashcardLink moduleId={resolvedParams.moduleId} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Submodules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.subModules.map((submodule) => (
            <Card key={submodule.id}>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">{submodule.number}: {submodule.title}</h3>
                <SubmoduleLink moduleId={resolvedParams.moduleId} submodule={submodule} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ Client component for flashcard creation link
function CreateFlashcardLink({ moduleId }: { moduleId: string }) {
  return (
    <Link href={`/flashcards/create?moduleId=${moduleId}`}>
      <Button>Create Flashcards</Button>
    </Link>
  );
}

// ✅ Client component for submodule links
function SubmoduleLink({ moduleId, submodule }: { moduleId: string; submodule: any }) {
  return (
    <Link href={`/flashcards/create?moduleId=${moduleId}&subModuleId=${submodule.id}`}>
      <Button variant="outline" size="sm">Add Flashcards</Button>
    </Link>
  );
}
