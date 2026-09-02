'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CurrentUser } from '@/server/auth';
import { useLocation } from '@/lib/router';
import { C, UI } from '../tokens';
import Nav from './Nav';
import Footer from './Footer';

function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right');
      if (!els.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
      );

      els.forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });

      return observer;
    };

    // Small delay so the DOM has settled after route change
    const id = setTimeout(() => {
      const obs = observe();
      return () => obs?.disconnect();
    }, 60);

    return () => clearTimeout(id);
  }, [pathname]);
}

export default function Root({ children, user }: { children: ReactNode; user: CurrentUser | null }) {
  useScrollReveal();

  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal, fontFamily: UI, overflowX: 'hidden', minHeight: '100vh' }}>
      <Nav user={user} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
