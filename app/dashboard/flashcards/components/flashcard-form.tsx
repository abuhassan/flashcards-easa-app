"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FlashcardFormProps {
  EASA_MODULES: { id: string; name: string }[];
  submodules: { id: string; title: string }[];
}

export default function FlashcardForm({ EASA_MODULES, submodules }: FlashcardFormProps) {
  const [formData, setFormData] = useState({
    module: EASA_MODULES.length > 0 ? EASA_MODULES[0].id : "none",
    subModule: submodules.length > 0 ? submodules[0].id : "none",
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Move handleSubmit inside the component
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Submitting Flashcard:", formData);
    // Add API request or database logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Module Selection */}
      <div className="space-y-2">
        <label htmlFor="module">EASA Module</label>
        <Select value={formData.module} onValueChange={(value) => handleSelectChange("module", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {EASA_MODULES.length === 0 ? (
              <SelectItem value="none" disabled>No Modules Available</SelectItem>
            ) : (
              EASA_MODULES.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  Module {module.id}: {module.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Submodule Selection */}
      <div className="space-y-2">
        <label htmlFor="subModule">Submodule (Optional)</label>
        <Select value={formData.subModule} onValueChange={(value) => handleSelectChange("subModule", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a submodule" />
          </SelectTrigger>
          <SelectContent>
            {submodules.length === 0 ? (
              <SelectItem value="none" disabled>No Submodules Available</SelectItem>
            ) : (
              submodules.map((submodule) => (
                <SelectItem key={submodule.id} value={submodule.id}>
                  {submodule.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <Button type="submit">Save Flashcard</Button>
      </div>
    </form>
  );
}
