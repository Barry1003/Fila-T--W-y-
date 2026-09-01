# Fila Tó Wúyì

Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4 storefront and
owner console. Package manager: **pnpm**.

## Commands

- `pnpm dev` — dev server on http://localhost:3000
- `pnpm build` — production build
- `pnpm lint` — `tsc --noEmit`

Run `pnpm build` before declaring work done; it type-checks the whole tree.

## Structure

- `src/app/**/page.tsx` — route files. Keep them one-liners that re-export the
  component from `src/views`; put the actual UI in `src/views`.
- `src/app/(site)/layout.tsx` — storefront shell (`Nav` + `Footer`).
- `src/app/console/layout.tsx` — owner console shell (sidebar + header).
- `src/views/` — page components. Note: **not** `src/pages`, which Next would
  claim for the legacy Pages Router.
- `src/components/` — shared chrome and shells.
- `src/lib/router.tsx` — `Link`, `NavLink`, `useNavigate`, `useLocation`,
  `useParams`. Import navigation helpers from here, not `next/link` directly, so
  active-link styling stays consistent.
- `src/tokens.ts` — brand colours (`C`), font stacks (`DISPLAY`, `UI`) and the
  shared `label` text style. Use these instead of hard-coded hex values.
- `src/index.css` — global CSS, font imports and `@import 'tailwindcss'`.

## Conventions

- Every component under `src/views` and `src/components` is a client component
  (`'use client'` at the top); route files stay server components.
- Styling is mostly inline `style` objects built from `src/tokens.ts`, with
  Tailwind available for utility work.
- Use double quotes around strings containing apostrophes, and default-export
  components.
