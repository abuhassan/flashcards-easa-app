// auth/auth.config.ts
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

type CredentialsType = {
  email: string
  password: string
}

export const authConfig = {
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth
      const requestUrl = new URL(request.url)
      const isOnDashboard = requestUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { email, password } = credentials as CredentialsType

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user?.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified
        }
      }
    })
  ]
} satisfies NextAuthConfig