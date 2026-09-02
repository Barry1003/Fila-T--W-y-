# Fila Tó Wúyì

Storefront and owner console for **Fila Tó Wúyì by AdeClassics** — handcrafted
Nigerian caps and headwear, made to order.

Built with [Next.js](https://nextjs.org) (App Router), React 19, TypeScript and
Tailwind CSS v4.

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000.

| Script             | Does                                        |
| ------------------ | ------------------------------------------- |
| `pnpm dev`         | Development server with hot reload           |
| `pnpm build`       | Production build                             |
| `pnpm start`       | Serve the production build                   |
| `pnpm lint`        | TypeScript type-check (`tsc --noEmit`)       |
| `pnpm db:migrate`  | Create and apply a migration                 |
| `pnpm db:seed`     | Replace all data with the sample data set    |
| `pnpm db:studio`   | Browse the database in Prisma Studio         |

## Database

Postgres on [Neon](https://neon.tech), through Prisma. Copy `.env.example` to
`.env` and fill in both URLs from the Neon dashboard:

- `DATABASE_URL` — the **pooled** endpoint (its host contains `-pooler`). The
  app queries through this.
- `DIRECT_URL` — the **direct** endpoint. Prisma Migrate needs it, because
  migrations take advisory locks a connection pooler will not hold.

Then set the database up:

```bash
pnpm db:migrate
```

```bash
pnpm db:seed
```

The seed clears every table and reloads the sample catalogue, orders, reviews,
custom requests, promotions and support threads, so it is safe to re-run. It
refuses to run when `NODE_ENV=production` unless `SEED_ALLOW_PRODUCTION=yes`.

### How it connects

The app and the seed use `@prisma/adapter-neon`, which reaches Neon over
HTTPS/WebSocket on port 443. That is what Neon recommends for serverless
deployments, and it also works on networks that block the Postgres wire
protocol. `prisma migrate` does not go through the adapter, so it still needs
outbound **port 5432** — if migrations time out while the app works fine, that
port is blocked on your network.

## Project structure

```
src/
  app/                 App Router route tree (thin re-exports of views)
    (site)/            Storefront pages, wrapped in the Nav/Footer shell
    console/           Owner console, wrapped in the console shell
    checkout/          Standalone flows with no storefront chrome
  components/          Shared shells and chrome (Nav, Footer, Root, shells)
  views/               Page components — one per route
  data/                Product catalogue used by the UI and the seed
  lib/router.tsx       Router helpers (`Link`, `NavLink`, `useNavigate`, …)
  lib/prisma.ts        Shared Prisma client — import `prisma` from here
  generated/prisma/    Prisma client, generated (gitignored)
  icons.tsx            Inline SVG icon set
  tokens.ts            Brand colours, fonts and shared text styles
  index.css            Global styles and the Tailwind import
prisma/
  schema.prisma        Database schema — the source of truth
  migrations/          Applied migrations
  seed.ts              Sample data loader (`pnpm db:seed`)
```

Route files under `src/app` stay deliberately thin — each one re-exports the
matching component from `src/views`, so the pages themselves are plain React
components that are easy to move or reuse.

### Routing

`src/lib/router.tsx` wraps `next/link` and `next/navigation` behind a small
`Link` / `NavLink` / `useNavigate` / `useLocation` / `useParams` API, which keeps
active-link styling and imperative navigation in one place.

## Notes

The views still read their in-file sample data; the database is seeded and
ready, but the components have not been switched over to query it yet.
