// app/dashboard/page.tsx
import { ModuleOverview } from "../components/dashboard/module-overview";
import { StudyReminder } from "../components/dashboard/study-reminder";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | EASA Flashcards",
  description: "Track your learning progress for EASA Part 66 modules",
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Your Learning Dashboard</h1>
      <p className="text-muted-foreground mb-8">Track your EASA Part 66 exam preparation</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ModuleOverview />
        </div>
        <div className="lg:col-span-1">
          <StudyReminder userName={session.user.name || "there"} />
        </div>
      </div>
    </div>
  );
}