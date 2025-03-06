// app/dashboard/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '../dashboard/components/navbar';
import Sidebar from '../dashboard/components/sidebar';
import AuthenticationWrapper from '../dashboard/components/authentication-wrapper';

export const metadata: Metadata = {
  title: 'Dashboard | EASA Flashcards',
  description: 'Your EASA Part 66 exam preparation dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/sign-in');
  }
  
  return (
    <AuthenticationWrapper>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar user={session.user} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthenticationWrapper>
  );
}