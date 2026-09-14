'use client';

import { useEffect } from 'react';

/**
 * Makes `.card-table` tables readable once they stack into cards on mobile.
 *
 * The card CSS shows each cell's column name via `td::before { content: attr(data-label) }`.
 * Rather than hand-writing `data-label` on every cell across the console, this
 * copies each header's text onto the cells beneath it, by column index, and
 * keeps them in step as rows change (filtering, pagination) via a MutationObserver.
 */
export default function CardTableLabels() {
  useEffect(() => {
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      document.querySelectorAll<HTMLTableElement>('table.card-table').forEach(table => {
        const heads = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() ?? '');
        table.querySelectorAll('tbody tr').forEach(row => {
          Array.from(row.children).forEach((cell, i) => {
            if (cell.tagName === 'TD') cell.setAttribute('data-label', heads[i] ?? '');
          });
        });
      });
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(apply);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
