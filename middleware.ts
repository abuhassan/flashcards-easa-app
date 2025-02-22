// middleware.ts
import { auth } from '@/auth/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((request) => {
  const isAuthenticated = !!request.auth
  const requestUrl = new URL(request.url)
  
  if (!isAuthenticated && requestUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}