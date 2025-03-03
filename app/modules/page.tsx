// app/modules/page.tsx
import { Metadata } from "next";
import { ModuleSelection } from "../components/modules/module-selection";

export const metadata: Metadata = {
  title: "EASA Modules | Flashcards App",
  description: "Select EASA Part 66 modules for your study plan",
};

export default function ModulesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">EASA Part 66 Modules</h1>
      <p className="text-muted-foreground mb-8">
        Select the modules you're currently studying for your EASA Part 66 license
      </p>
      
      <ModuleSelection />
    </div>
  );
}