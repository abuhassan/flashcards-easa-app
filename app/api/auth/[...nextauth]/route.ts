// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

// Export the NextAuth API route handlers
export const { GET, POST } = handlers;