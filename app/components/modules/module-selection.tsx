// components/modules/module-selection.tsx
"use client";

import { useEffect, useState } from "react";
import { getModules, getCurrentUserModules, toggleModule } from "@/app/actions/module-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Module, SubModule } from "@/types";

export function ModuleSelection() {
  const [modules, setModules] = useState<Module[]>([]);
  const [userModuleIds, setUserModuleIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load all modules
        const allModules = await getModules();
        setModules(allModules);

        // Load user's selected modules
        const userModules = await getCurrentUserModules();
        const userModuleIdSet = new Set(userModules.map(um => um.moduleId));
        setUserModuleIds(userModuleIdSet);
      } catch (error) {
        console.error("Failed to load modules:", error);
        toast.error("Failed to load modules");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

 // In your module-selection.tsx component
const handleModuleToggle = async (moduleId: string) => {
  console.log("Checkbox clicked for module:", moduleId);
  try {
    // Optimistically update UI
    setUserModuleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        console.log("Removing module from selected set:", moduleId);
        newSet.delete(moduleId);
      } else {
        console.log("Adding module to selected set:", moduleId);
        newSet.add(moduleId);
      }
      return newSet;
    });

    // Update in database
    console.log("Calling toggleModule server action with moduleId:", moduleId);
    await toggleModule(moduleId);
    console.log("Server action completed successfully");
  } catch (error) {
    console.error("Error in handleModuleToggle:", error);
    // Rest of your error handling code
  }
};

  // Define the save preferences handler as a regular function
  function handleSavePreferences() {
    // Show success toast
    toast.success('Module preferences saved!');
  }

  const filteredModules = activeTab === "ALL" 
    ? modules 
    : modules.filter(module => module.category === activeTab || module.category === "ALL");

  if (loading) {
    return <div className="flex justify-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="ALL" 
        onValueChange={(value) => {
        console.log("Tab changed to:", value);
        setActiveTab(value);
        }}
      > 
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="A">Category A</TabsTrigger>
          <TabsTrigger value="B1">Category B1</TabsTrigger>
          <TabsTrigger value="B2">Category B2</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => (
          <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  Module {module.number}: {module.title}
                </CardTitle>
                <Checkbox 
                  checked={userModuleIds.has(module.id)} 
                  onCheckedChange={() => handleModuleToggle(module.id)}
                  className="h-5 w-5"
                />
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {module.subModules.slice(0, 5).map((sub: SubModule) => (
                  <Badge key={sub.id} variant="outline">
                    {sub.number}
                  </Badge>
                ))}
                {module.subModules.length > 5 && (
                  <Badge variant="outline">+{module.subModules.length - 5} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No modules found for the selected category
          </div>
        )}
      </div>


      
      <div className="flex justify-center mt-8">
      <Button 
          onClick={handleSavePreferences}
          className="w-full max-w-xs"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}