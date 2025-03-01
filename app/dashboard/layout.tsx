// app/dashboard/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import AuthenticationWrapper from './components/authentication-wrapper';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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