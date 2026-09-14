import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/index.css';
import AppwritePing from '@/components/AppwritePing';
import { CartProvider } from '@/lib/cart';
import { PageTransitionProvider } from '@/lib/PageTransition';

export const metadata: Metadata = {
  title: 'AdeClassics — Timeless Elegance',
  description: 'Handcrafted Nigerian caps, headwear and tailoring, made to order.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppwritePing />
        {/* Cart, Checkout and the confirmation sit in different route groups,
            so the provider goes here rather than in the storefront shell. */}
        <PageTransitionProvider>
          <CartProvider>{children}</CartProvider>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
