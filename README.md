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

| Script       | Does                                    |
| ------------ | --------------------------------------- |
| `pnpm dev`   | Development server with hot reload       |
| `pnpm build` | Production build                         |
| `pnpm start` | Serve the production build               |
| `pnpm lint`  | TypeScript type-check (`tsc --noEmit`)   |

## Project structure

```
src/
  app/                 App Router route tree (thin re-exports of views)
    (site)/            Storefront pages, wrapped in the Nav/Footer shell
    console/           Owner console, wrapped in the console shell
    checkout/          Standalone flows with no storefront chrome
  components/          Shared shells and chrome (Nav, Footer, Root, shells)
  views/               Page components — one per route
  data/                Mock product catalogue
  lib/router.tsx       Router helpers (`Link`, `NavLink`, `useNavigate`, …)
  icons.tsx            Inline SVG icon set
  tokens.ts            Brand colours, fonts and shared text styles
  index.css            Global styles and the Tailwind import
```

Route files under `src/app` stay deliberately thin — each one re-exports the
matching component from `src/views`, so the pages themselves are plain React
components that are easy to move or reuse.

### Routing

`src/lib/router.tsx` wraps `next/link` and `next/navigation` behind a small
`Link` / `NavLink` / `useNavigate` / `useLocation` / `useParams` API, which keeps
active-link styling and imperative navigation in one place.

## Notes

All data is currently mocked in-app; there is no backend yet.
