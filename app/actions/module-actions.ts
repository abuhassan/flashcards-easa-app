// app/actions/module-actions.ts
"use server"

import { auth } from "@/lib/auth";
import { getAllModules, getUserModules, toggleUserModule } from "@/lib/modules";
import { revalidatePath } from "next/cache";

export async function getModules() {
  return getAllModules();
}

export async function getCurrentUserModules() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  
  return getUserModules(session.user.id);
}

// In your module-actions.ts file
export async function toggleModule(moduleId: string) {
  console.log("Server action toggleModule called with:", moduleId);
  
  const session = await auth();
  
  if (!session?.user?.id) {
    console.error("No authenticated user found");
    throw new Error("Authentication required");
  }
  
  try {
    console.log("Toggling module for user:", session.user.id);
    await toggleUserModule(session.user.id, moduleId);
    
    // Revalidate relevant paths to refresh data
    revalidatePath("/modules");
    revalidatePath("/dashboard");
    
    console.log("Module toggle successful");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleModule server action:", error);
    throw error;
  }
}