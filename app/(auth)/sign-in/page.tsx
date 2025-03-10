// app/(auth)/sign-in/page.tsx
import { Metadata } from 'next';
import SignInForm from './sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In | EASA Flashcards',
  description: 'Sign in to your EASA Flashcards account',
};

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}