// components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../components/mode-toggle"
import { useAuth } from "../hooks/use-auth"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  GraduationCap,
  LogIn,
  LogOut,
  User,
} from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { session, signOut } = useAuth()

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">EASA Flashcards</span>
        </Link>

        <div className="flex items-center space-x-1 mr-auto">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className={cn(
                  "text-sm",
                  pathname === "/dashboard" && "bg-accent"
                )}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/flashcards">
                <Button variant="ghost" className={cn(
                  "text-sm",
                  pathname === "/flashcards" && "bg-accent"
                )}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Flashcards
                </Button>
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}