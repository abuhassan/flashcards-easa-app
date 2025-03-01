// lib/auth.config.ts
import type { NextAuthConfig } from 'next-auth';

// We're keeping this minimal since we're implementing
// most of the functionality in auth.ts
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
  },
  providers: [], // We'll configure these in auth.ts
};