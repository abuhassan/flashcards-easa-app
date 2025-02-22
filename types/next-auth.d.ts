// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth'
import type { NextRequest } from 'next/server'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    name: string | null
    emailVerified: Date | null
  }
}

declare module 'next/server' {
  interface NextRequest {
    auth: any
  }
}