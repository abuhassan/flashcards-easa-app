"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ redirectTo: "/sign-out" })}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
}
