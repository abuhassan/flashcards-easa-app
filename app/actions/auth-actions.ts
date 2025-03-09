// app/actions/auth-actions.ts
'use server';

import { signOut as authSignOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Server action for sign out
export async function signOutAction() {
  await authSignOut();
  redirect('/');
}