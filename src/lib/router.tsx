'use client';

/**
 * Thin compatibility layer over the Next.js App Router.
 *
 * The UI was originally written against react-router, so this module keeps the
 * familiar `<Link to>` / `<NavLink to>` / `useNavigate` surface while delegating
 * everything to `next/link` and `next/navigation`.
 */

import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

type AnchorProps = Omit<ComponentProps<typeof NextLink>, 'href' | 'children' | 'className' | 'style'>;

type LinkProps = AnchorProps & {
  to: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Link({ to, children, className, style, ...rest }: LinkProps) {
  return (
    <NextLink href={to} className={className} style={style} {...rest}>
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

export function NavLink({ to, end, children, className, style, ...rest }: NavLinkProps) {
  const pathname = usePathname() ?? '/';
  const isActive = end || to === '/' ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const state: ActiveState = { isActive };

  return (
    <NextLink
      href={to}
      className={typeof className === 'function' ? className(state) : className}
      style={typeof style === 'function' ? style(state) : style}
      {...rest}
    >
      {typeof children === 'function' ? children(state) : children}
    </NextLink>
  );
}

/** Returns a `navigate('/path')` function, mirroring react-router's hook. */
export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

/** Returns the current pathname in a react-router shaped object. */
export function useLocation() {
  const pathname = usePathname() ?? '/';
  return { pathname };
}

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
