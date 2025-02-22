// app/layout.tsx
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { SessionProvider } from "../components/session-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EASA Part 66 Flashcards",
  description: "Study and prepare for EASA Part 66 certification",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen bg-background">
              <Navbar />
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}