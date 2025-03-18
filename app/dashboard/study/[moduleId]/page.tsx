"use client"; // ✅ Required for Client Components

import { useParams } from "next/navigation"; // ✅ Correct way to access dynamic params
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample module data (Replace this with real DB data)
const moduleData = {
  "module-1": {
    id: "module-1",
    title: "Mathematics",
    description: "Arithmetic, algebra, geometry and basic trigonometry.",
    topics: ["Arithmetic", "Algebra", "Geometry", "Trigonometry"],
  },
  "module-3": {
    id: "module-3",
    title: "Basic Electricity",
    description: "Electron theory, static electricity, and DC circuits.",
    topics: ["Electron Theory", "Static Electricity", "Resistors", "Capacitors"],
  },
};

export default function ModuleStudySetupPage() {
  const { moduleId } = useParams(); // ✅ Fix: Using useParams()
  const router = useRouter();

  // Retrieve the module data
  const module = moduleData[moduleId as keyof typeof moduleData];

  if (!module) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The module you're looking for doesn't exist or hasn't been implemented yet.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div>
          <Badge className="bg-primary/10 text-primary">Module {moduleId}</Badge>
          <h1 className="text-2xl font-bold">{module.title}</h1>
          <p className="text-gray-600">{module.description}</p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Topics</h2>
        <ul className="list-disc pl-6">
          {module.topics.map((topic, index) => (
            <li key={index} className="text-gray-700">{topic}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
