"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/sign-in" }); // Redirect to Sign-In
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Signing out...</p>
    </div>
  );
}
