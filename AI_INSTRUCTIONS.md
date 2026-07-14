# AI instructions â project boilerplate starter

## Purpose

This directory is a **complete runnable empty product** with the same tooling as Developer Control Tower.

When building a new app:

1. **Start from this tree** (copy all files).
2. **Do not** regenerate `package.json`, Vite, Tailwind, or tsconfig from scratch.
3. **Implement** domains by adding pages, services, hooks, migrations, and edge functions.
4. **Compose** UI from small parts â see `src/components/examples/ExampleFeature.tsx` and `/composition`.

## Hard boundaries

- Stack stays: React + Vite + Tailwind + Radix/shadcn + lucide + Zod + React Query + Supabase.
- Prefer existing UI primitives under `src/components/ui`. Add more with shadcn, same aliases.
- Data access only through `src/lib/api/*` + hooks in `src/hooks/*`.
- Edge Functions under `supabase/functions/<name>/index.ts`; shared helpers in `_shared/`.
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` only for the browser client.

## React composition (required)

| Do | Don't |
|----|--------|
| Compose with `children` and `ReactNode` slots | Giant components with many boolean flags (`showX`) |
| Use compound layouts: `PageLayout` + `Header` / `Content` / `Footer` | Duplicate page shells per route |
| Split features into Toolbar + List + Card + EmptyState | One 500-line feature file |
| Use `renderItem` / slot props to customize | Copy-paste nearly identical lists |
| Nest providers in `AppProviders` | Scatter providers in every page |
| Lazy-load route pages in `App.tsx` | Eager-import every page into the main bundle |

Reference implementations:

- `src/components/layout/PageLayout.tsx` â compound layout
- `src/components/layout/EmptyState.tsx` â slot-based empty UI
- `src/components/examples/ExampleFeature.tsx` â feature composition
- `src/pages/CompositionDemoPage.tsx` â page that only composes

## What to change for a new product

| Do | Don't |
|----|--------|
| Rename title in `index.html` / HomePage | Swap to Next.js / Prisma / another CSS system |
| Add lazy routes in `App.tsx` | Delete `cn()`, QueryClient, or Supabase client |
| Add tables + RLS in `supabase/migrations` | Call Supabase directly from components |
| Add UI with existing tokens (`primary`, `muted`, etc.) | Hard-code one-off color systems |

## Suggested generation order

1. Domain types + DB migration + RLS
2. `lib/api` services + React Query hooks
3. Small presentational pieces (list row, empty, toolbar)
4. Feature component that composes those pieces
5. Page = `PageLayout` + feature (lazy route)
6. Edge functions only if server secrets / privileged work is required

## Frontend-only vs full-stack

- If requirements are UI-only: keep Supabase client wired but unused tables ok.
- If full-stack: migrations + RLS + optional edge functions; never invent a second backend.
