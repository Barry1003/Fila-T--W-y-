'use client';

import { useEffect } from 'react';

/**
 * Shared behaviour for slide-in panels (the storefront menu, the console
 * sidebar): while `open`, the page behind cannot scroll and Escape closes.
 */
export function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);
}
