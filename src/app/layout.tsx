import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/index.css';

export const metadata: Metadata = {
  title: 'Fila Tó Wúyì — by AdeClassics',
  description: 'Handcrafted Nigerian caps and headwear, made to order.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
