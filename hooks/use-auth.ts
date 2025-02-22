// hooks/use-auth.ts
"use client"

import { useSession, signOut as nextAuthSignOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return {
    session,
    status,
    signOut,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  }
}