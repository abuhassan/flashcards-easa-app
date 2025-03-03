// app/layout.tsx
import { AuthProvider } from "./providers";
import { MainNav } from "./components/layout/main-nav";
import Link from "next/link";
import './globals.css'; 
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      <html lang="en">
        <body>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <header className="border-b">
                <div className="container flex h-16 items-center">
                  <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="font-bold text-xl">EASA Flashcards</span>
                    </Link>
                  </div>
                  <MainNav />
                  <div className="ml-auto flex items-center space-x-4">
                    {/* User account navigation component */}
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                  <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} EASA Flashcards. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
          
        </body>
      </html>
    </>
  );
}