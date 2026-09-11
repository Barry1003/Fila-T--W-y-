'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * The shopping cart.
 *
 * Cart and Checkout used to keep separate hardcoded lists, which is why a promo
 * code entered on one never reached the other. Both now read from here, so the
 * two screens cannot disagree about what someone is buying.
 *
 * The cart lives in the browser, not the database. An anonymous shopper has
 * nowhere on the server to keep one, and a cart is cheap to rebuild — losing it
 * is a small annoyance, whereas a half-written server cart is a support problem.
 * Prices held here are for display only: `placeOrder` re-reads every price from
 * the catalogue before it charges anyone, so a tampered localStorage buys
 * nothing at a discount.
 */

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  /** Snapshotted so the cart still reads correctly if the catalogue changes. */
  size: string;
  color: string;
  unitPriceCents: number;
  imageUrl: string;
  quantity: number;
};

/** What a caller needs to supply to add something; quantity defaults to 1. */
export type NewCartLine = Omit<CartLine, 'quantity'> & { quantity?: number };

type CartContextValue = {
  lines: CartLine[];
  /** Total number of garments, not number of lines — that is what a cart badge counts. */
  count: number;
  subtotalCents: number;
  /**
   * False until localStorage has been read. Rendering a stored cart during the
   * first paint would not match the server's empty one, so consumers wait.
   */
  hydrated: boolean;
  add: (line: NewCartLine) => void;
  setQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  remove: (productId: string, size: string, color: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'ac_cart_v1';
const MAX_PER_LINE = 20;

const CartContext = createContext<CartContextValue | null>(null);

/**
 * A product in a given size and colour is its own line, the way a shopper thinks
 * of it — two colours of the same cap are two lines, and stock is claimed per
 * size+colour at checkout, so the identity here must match.
 */
function sameLine(line: CartLine, productId: string, size: string, color: string): boolean {
  return line.productId === productId && line.size === size && line.color === color;
}

/**
 * Anything could be sitting under our key — an older shape, another tab's
 * experiment, or hand-edited nonsense. Drop lines that do not typecheck rather
 * than letting one bad entry crash the storefront.
 */
function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((line): line is CartLine => {
      if (typeof line !== 'object' || line === null) return false;
      const l = line as Record<string, unknown>;
      return (
        typeof l.productId === 'string' &&
        typeof l.slug === 'string' &&
        typeof l.title === 'string' &&
        typeof l.size === 'string' &&
        typeof l.color === 'string' &&
        typeof l.imageUrl === 'string' &&
        typeof l.unitPriceCents === 'number' &&
        Number.isFinite(l.unitPriceCents) &&
        typeof l.quantity === 'number' &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read once on mount. Doing this in an effect rather than in useState's
  // initialiser keeps the first client render identical to the server's.
  useEffect(() => {
    try {
      setLines(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // Private browsing and blocked site data both throw here. An empty cart
      // that works beats a storage error that takes the page down.
    }
    setHydrated(true);
  }, []);

  // Write back on every change, but not before the first read — otherwise the
  // initial empty state would overwrite a cart the shopper already had.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage full or unavailable. The cart still works for this visit.
    }
  }, [lines, hydrated]);

  // A second tab is the same shopper with the same cart; keep them in step.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setLines(parseStored(event.newValue));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((incoming: NewCartLine) => {
    const quantity = Math.max(1, Math.floor(incoming.quantity ?? 1));

    setLines(prev => {
      const existing = prev.find(line => sameLine(line, incoming.productId, incoming.size, incoming.color));
      if (!existing) {
        return [...prev, { ...incoming, quantity: Math.min(quantity, MAX_PER_LINE) }];
      }

      // Adding the same size and colour again tops up the line rather than
      // duplicating it.
      return prev.map(line =>
        sameLine(line, incoming.productId, incoming.size, incoming.color)
          ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_PER_LINE) }
          : line
      );
    });
  }, []);

  const setQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    const next = Math.floor(quantity);

    // Stepping below one is how a shopper removes the last of something.
    if (next < 1) {
      setLines(prev => prev.filter(line => !sameLine(line, productId, size, color)));
      return;
    }

    setLines(prev =>
      prev.map(line =>
        sameLine(line, productId, size, color)
          ? { ...line, quantity: Math.min(next, MAX_PER_LINE) }
          : line
      )
    );
  }, []);

  const remove = useCallback((productId: string, size: string, color: string) => {
    setLines(prev => prev.filter(line => !sameLine(line, productId, size, color)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((total, line) => total + line.quantity, 0),
    subtotalCents: lines.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0),
    hydrated,
    add,
    setQuantity,
    remove,
    clear,
  }), [lines, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider — see src/app/(site)/layout.tsx.');
  }
  return context;
}
