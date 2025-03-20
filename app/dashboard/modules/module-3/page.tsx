"use client"; // ✅ Needed for useParams()

import { useParams } from "next/navigation"; // ✅ Correct way to access params in Next.js 15
import { initialModules } from "@/lib/data/module-data";

export default function ModulePage() {
  const { moduleId } = useParams(); // ✅ Use `useParams()` instead of direct `params`

  const module = initialModules.find((m) => m.id === moduleId);

  if (!module) {
    return <p className="text-red-500">Module not found</p>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">
        Module {module.number}: {module.title}
      </h1>
      <p className="text-gray-600">{module.description}</p>

      <h2 className="text-xl font-semibold mt-6 mb-4">Topics</h2>
      <ul className="list-disc pl-6">
        {module.topics.map((topic, index) => (
          <li key={index} className="text-gray-700">{topic}</li>
        ))}
      </ul>
    </div>
  );
}
