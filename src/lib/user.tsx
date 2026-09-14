'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CurrentUser } from '@/server/auth';

export type { CurrentUser };

const UserContext = createContext<CurrentUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): CurrentUser | null {
  return useContext(UserContext);
}

/**
 * Extracts initials from a user's name.
 * If 1 part ("Ishola") -> "I".
 * If 2+ parts ("Ishola Adeyemi") -> "IA" (when max >= 2).
 */
export function getInitials(name?: string | null, max = 2): string {
  if (!name?.trim()) return max === 1 ? 'A' : 'AO';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return max === 1 ? 'A' : 'AO';
  if (parts.length === 1 || max === 1) return parts[0][0].toUpperCase();
  return parts
    .slice(0, max)
    .map((p) => p[0].toUpperCase())
    .join('');
}
