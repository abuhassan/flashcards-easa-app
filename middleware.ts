// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Log authentication state for debugging
  console.log('Middleware running on path:', request.nextUrl.pathname);
  console.log('Authentication state:', !!session?.user);
  
  // Protected routes (dashboard area)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Not authenticated - redirect to sign-in
    if (!session?.user) {
      console.log('Redirecting unauthenticated user to sign-in');
      
      const signInUrl = new URL('/sign-in', request.url);
      // Add the current URL as the callbackUrl parameter
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      
      return NextResponse.redirect(signInUrl);
    }
  }
  
  // Auth routes - redirect to dashboard if already authenticated
  if (session?.user && 
      (request.nextUrl.pathname === '/sign-in' || 
       request.nextUrl.pathname === '/sign-up')) {
    console.log('Redirecting authenticated user to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Ensure middleware runs on these paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
  ],
};