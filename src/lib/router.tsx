'use client';

/**
 * Thin compatibility layer over the Next.js App Router.
 *
 * The UI was originally written against react-router, so this module keeps the
 * familiar `<Link to>` / `<NavLink to>` / `useNavigate` surface while delegating
 * everything to `next/link` and `next/navigation`.
 */

import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { usePageTransition } from './PageTransition';

type AnchorProps = Omit<ComponentProps<typeof NextLink>, 'href' | 'children' | 'className' | 'style'>;

type LinkProps = AnchorProps & {
  to: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Link({ to, children, className, style, onClick, ...rest }: LinkProps) {
  const { startTransition } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      // Basic check: only trigger if actually navigating somewhere new
      // (ignores hash changes or same page if desired, but we can just trigger always for simplicity,
      // or check if `to` starts with something different)
      if (to && to !== pathname) {
        startTransition();
      }
    }
  };

  return (
    <NextLink href={to} className={className} style={style} onClick={handleClick} {...rest}>
      {children}
    </NextLink>
  );
}

type ActiveState = { isActive: boolean };

type NavLinkProps = AnchorProps & {
  to: string;
  /** Match the path exactly instead of treating it as a prefix. */
  end?: boolean;
  children?: ReactNode | ((state: ActiveState) => ReactNode);
  className?: string | ((state: ActiveState) => string);
  style?: CSSProperties | ((state: ActiveState) => CSSProperties);
};

export function NavLink({ to, end, children, className, style, onClick, ...rest }: NavLinkProps) {
  const pathname = usePathname() ?? '/';
  const isActive = end || to === '/' ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const state: ActiveState = { isActive };
  const { startTransition } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      if (to && to !== pathname) {
        startTransition();
      }
    }
  };

  return (
    <NextLink
      href={to}
      className={typeof className === 'function' ? className(state) : className}
      style={typeof style === 'function' ? style(state) : style}
      onClick={handleClick}
      {...rest}
    >
      {typeof children === 'function' ? children(state) : children}
    </NextLink>
  );
}

/** Returns a `navigate('/path')` function, mirroring react-router's hook. */
export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = usePageTransition();

  return (to: string) => {
    // Skip the intro when we are already where we are going — otherwise the
    // path never changes and the loader would have nothing to wait for.
    if (to.split('?')[0] !== pathname) startTransition();
    router.push(to);
  };
}

/** Returns the current pathname in a react-router shaped object. */
export function useLocation() {
  const pathname = usePathname() ?? '/';
  return { pathname };
}

export { useSearchParams };

/**
 * Route params flattened to plain strings — Next hands catch-all segments back
 * as arrays, which callers here never use.
 */
export function useParams(): Record<string, string | undefined> {
  const params = useNextParams();
  return Object.fromEntries(
    Object.entries(params ?? {}).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
}
