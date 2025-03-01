// app/(auth)/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // If user is already authenticated, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <header className="py-4 shadow-sm bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EASA Flashcards</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/#features" className="text-sm text-gray-600 hover:text-blue-600">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-gray-600 hover:text-blue-600">
              Pricing
            </Link>
            <Link href="/#about" className="text-sm text-gray-600 hover:text-blue-600">
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow grid place-items-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} EASA Flashcards. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}