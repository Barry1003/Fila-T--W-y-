'use client';

import type { ReactNode } from 'react';
import { authClient } from '@/lib/auth/client';
import { useNavigate } from '@/lib/router';
import { usePageTransition } from '@/lib/PageTransition';

/**
 * Signs the visitor out through the Neon Auth client, then navigates home.
 * Firing `startTransition` first gives signing out the same branded intro as any
 * other navigation.
 */
export default function SignOutForm({ children, className }: { children: ReactNode; className?: string }) {
  const { startTransition } = usePageTransition();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition();
    await authClient.signOut().catch(() => {});
    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
