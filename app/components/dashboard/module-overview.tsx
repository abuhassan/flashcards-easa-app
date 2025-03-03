// components/dashboard/module-overview.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { getCurrentUserModules } from "@/app/actions/module-actions";
import { Button } from "@/components/ui/button";
import { BookOpen, LayersIcon, PlusCircle } from "lucide-react";
import { UserModule } from "@/types";
import { toast } from "react-hot-toast";

export function ModuleOverview() {
  const [userModules, setUserModules] = useState<UserModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserModules() {
      try {
        setLoading(true);
        const data = await getCurrentUserModules();
        console.log("User modules loaded:", data);
        setUserModules(data);
      } catch (error) {
        console.error("Error loading user modules:", error);
        toast.error("Failed to load your modules");
      } finally {
        setLoading(false);
      }
    }
    
    loadUserModules();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading your modules...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userModules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-4">
            <p className="mb-4">You haven't selected any modules yet.</p>
            <Link href="/modules">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Select modules to study
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Modules</h3>
        <Link 
          href="/modules"
          className="text-sm text-primary hover:underline"
        >
          Manage modules
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userModules.map((userModule) => (
          <Card key={userModule.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Module {userModule.module.number}: {userModule.module.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>0%</span> {/* Will be updated with actual progress later */}
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-muted-foreground">
                  {userModule.module.subModules.length} submodules
                </span>
                <Link 
                  href={`/study/${userModule.moduleId}`}
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Study this module
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}