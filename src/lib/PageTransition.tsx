'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface TransitionContextType {
  startTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  startTransition: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/** Shown in sequence as the progress bar fills. */
const STATUS_MESSAGES = [
  'Entering AdeClassics…',
  'Preparing your selection…',
  'Refining timeless craftsmanship…',
  'Welcome.',
];

/** The branded intro plays for at least this long so the logo and progress are
 *  actually seen, even when the next route commits instantly. */
const MIN_VISIBLE_MS = 1300;

/** A hard cap so the loader can never trap the user — if a page never becomes
 *  ready (a hung request, or a same-route click), it still dismisses. */
const MAX_VISIBLE_MS = 5000;

/** How long to wait for the new page's images before revealing it anyway. */
const IMAGE_WAIT_MS = 3000;

/**
 * Resolves once every image currently in the document has loaded (or errored),
 * or after `timeout` ms — whichever comes first. Lets the loader lift on a page
 * that is actually painted rather than one still fetching its imagery.
 */
function waitForImages(timeout: number): Promise<void> {
  return new Promise(resolve => {
    const pending = Array.from(document.images).filter(img => !img.complete);
    if (pending.length === 0) {
      resolve();
      return;
    }
    let done = 0;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      pending.forEach(img => {
        img.removeEventListener('load', onOne);
        img.removeEventListener('error', onOne);
      });
      resolve();
    };
    const onOne = () => {
      done += 1;
      if (done >= pending.length) finish();
    };
    pending.forEach(img => {
      img.addEventListener('load', onOne);
      img.addEventListener('error', onOne);
    });
    setTimeout(finish, timeout);
  });
}

function NavigationTracker({
  isNavigating,
  navStartRef,
  setIsNavigating,
  setIsFadingOut,
}: {
  isNavigating: boolean;
  navStartRef: React.RefObject<number>;
  setIsNavigating: (v: boolean) => void;
  setIsFadingOut: (v: boolean) => void;
}) {
  // Deliberately only the pathname: useSearchParams() can suspend during a
  // navigation, which would freeze this tracker (and the loader) until the next
  // page fully resolves. usePathname() never suspends, so dismissal is reliable.
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    // Fire only on a genuine path change — the arrival of the new page — not on
    // `isNavigating` flipping on.
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    if (!isNavigating) return;

    let cancelled = false;
    let raf2 = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const reveal = () => {
      if (cancelled) return;
      setIsFadingOut(true);
      hideTimer = setTimeout(() => {
        setIsNavigating(false);
        setIsFadingOut(false);
      }, 500); // 500ms fade-out duration
    };

    // Give the new content a couple of frames to mount, then hold the loader
    // until its images have loaded AND the minimum on-screen time has passed —
    // so it lifts on a page that is ready to view, not one still loading in.
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const elapsed = performance.now() - navStartRef.current;
        const minReady = new Promise<void>(r => setTimeout(r, Math.max(0, MIN_VISIBLE_MS - elapsed)));
        const imagesReady = waitForImages(IMAGE_WAIT_MS);
        Promise.all([minReady, imagesReady]).then(reveal);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [pathname, isNavigating, navStartRef, setIsNavigating, setIsFadingOut]);

  return null;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const navStartRef = useRef(0);

  const startTransition = () => {
    navStartRef.current = performance.now();
    setIsNavigating(true);
    setIsFadingOut(false);
  };

  // Ease the bar toward 90% while the next page loads; when it arrives the
  // fade-out snaps it to 100%, so the number always reflects real state rather
  // than a fixed timer.
  useEffect(() => {
    if (!isNavigating) {
      setProgress(0);
      return;
    }
    if (isFadingOut) {
      setProgress(100);
      return;
    }

    setProgress(0);
    const start = performance.now();
    const CAP = 90;
    const DURATION = 1400;
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setProgress(Math.round(eased * CAP));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isNavigating, isFadingOut]);

  // Safety net: never leave the loader up longer than the hard cap, whatever
  // happens with the navigation. Runs in the provider (not in the tracker) so it
  // fires even if the tracker's render is delayed.
  useEffect(() => {
    if (!isNavigating) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    const capTimer = setTimeout(() => {
      setIsFadingOut(true);
      hideTimer = setTimeout(() => {
        setIsNavigating(false);
        setIsFadingOut(false);
      }, 500);
    }, MAX_VISIBLE_MS);

    return () => {
      clearTimeout(capTimer);
      clearTimeout(hideTimer);
    };
  }, [isNavigating]);

  const status =
    progress >= 90 ? STATUS_MESSAGES[3]
    : progress > 60 ? STATUS_MESSAGES[2]
    : progress > 25 ? STATUS_MESSAGES[1]
    : STATUS_MESSAGES[0];

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      <NavigationTracker
        isNavigating={isNavigating}
        navStartRef={navStartRef}
        setIsNavigating={setIsNavigating}
        setIsFadingOut={setIsFadingOut}
      />
      {isNavigating && (
        <div className={`global-page-loader ${isFadingOut ? 'fade-out' : ''}`} role="status" aria-live="polite">
          <div className="loader-vignette" aria-hidden="true" />

          {/* Floating golden dust */}
          <div className="loader-dust" aria-hidden="true">
            <span /><span /><span /><span />
          </div>

          <div className="loader-content">
            <div className="loader-logo-wrap">
              <div className="loader-glow" aria-hidden="true" />
              <img src="/logo-loader.png" alt="AdeClassics" className="loader-logo" />
            </div>

            <div className="loader-progress">
              <div className="loader-progress-track">
                <div className="loader-progress-bar" style={{ width: `${progress}%` }}>
                  <span className="loader-progress-pip" />
                </div>
              </div>
              <div className="loader-progress-meta">
                <span className="loader-status">{status}</span>
                <span className="loader-percent">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
