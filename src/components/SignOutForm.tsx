'use client';

import type { ReactNode } from 'react';
import { signOut } from '@/server/auth-actions';
import { usePageTransition } from '@/lib/PageTransition';

/**
 * Sign-out is a server action that redirects, so it never went through the
 * client router and the branded loader never played. Firing `startTransition`
 * on submit gives signing out the same intro as any other navigation.
 */
export default function SignOutForm({ children, className }: { children: ReactNode; className?: string }) {
  const { startTransition } = usePageTransition();
  return (
    <form action={signOut} onSubmit={() => startTransition()} className={className}>
      {children}
    </form>
  );
}
