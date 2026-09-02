import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/index.css';

export const metadata: Metadata = {
  title: 'AdeClassics — Timeless Elegance',
  description: 'Handcrafted Nigerian caps, headwear and tailoring, made to order.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
