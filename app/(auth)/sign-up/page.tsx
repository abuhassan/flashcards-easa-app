// app/(auth)/sign-up/page.tsx
import { Metadata } from 'next';
import SignUpForm from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up | EASA Flashcards',
  description: 'Create a new EASA Flashcards account',
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}