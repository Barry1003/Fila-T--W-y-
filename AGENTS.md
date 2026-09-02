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

## Responsive layout

Breakpoints, largest first:

| Width    | What changes                                                     |
| -------- | ---------------------------------------------------------------- |
| ≤ 1000px | Storefront nav collapses to the drawer; cart stays in the top bar |
| ≤ 900px  | Console sidebar becomes a slide-in; `.rg-split` and `.rg-3/4` collapse |
| ≤ 860px  | Account sidebar becomes the scrolling tab strip                   |
| ≤ 640px  | `.rg-2` collapses                                                 |
| ≤ 560px  | `.rg-3/4` go single column; nav shrinks; inputs go 16px           |

Column counts are set in inline styles, so grids opt into collapsing with a
class from `index.css`: `.rg-split` (content + fixed aside), `.rg-2`, `.rg-3`,
`.rg-4`. Each also sets `min-width: 0` on its children — without that a wide
child stretches its track past the viewport. Add one of these whenever you
write a grid with more than one column.

Wrap data tables in `<div className="table-scroll">` and give the table a
`minWidth`, so narrow screens scroll it rather than crushing the columns.

Both slide-in panels use `useOverlay(open, onClose)` from `src/lib/useOverlay.ts`
for scroll locking and Escape-to-close.

Some views also carry a local `<style>` block for layout that only they use;
check there before assuming a class is undefined.

## Database

Prisma against Neon Postgres. `prisma/schema.prisma` is the source of truth;
after editing it run `pnpm db:migrate` and the client regenerates.

- `src/lib/prisma.ts` — the shared client. Import `prisma` from here; never
  construct a `PrismaClient` anywhere else.
- The generated client lands in `src/generated/prisma` (gitignored). `.npmrc`
  hoists `@prisma/*` so that generated code can resolve its runtime under pnpm.
- Connection URLs live in `.env`, not in the schema — Prisma 7 reads them from
  `prisma.config.ts` for migrations, and the client gets them via the adapter.
- `pnpm db:seed` wipes and reloads sample data. `prisma/seed.ts` imports the
  catalogue from `src/data/products.ts` so it stays in step; the console
  fixtures are transcribed in `prisma/seed-data.ts`.
- App and seed talk to Neon over HTTPS (port 443) through
  `@prisma/adapter-neon`. Only `prisma migrate` needs port 5432.

## Conventions

- Every component under `src/views` and `src/components` is a client component
  (`'use client'` at the top); route files stay server components.
- Styling is mostly inline `style` objects built from `src/tokens.ts`, with
  Tailwind available for utility work.
- Use double quotes around strings containing apostrophes, and default-export
  components.
