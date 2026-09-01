import type { ReactNode } from 'react';
import Root from '@/components/Root';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <Root>{children}</Root>;
}
