<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KosEase

Next 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. Single package, no monorepo.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (`next build`)
- `npm start` — serve production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

No test runner, no CI workflows, no pre-commit hooks configured.

## Project Structure

- `src/app/` — App Router routes (`page.tsx`, `layout.tsx`, `kos/[id]/page.tsx`, `cari-kos/`, `dashboard/`, `login/`, `register/`)
- `src/components/` — shared UI components (Navbar, Hero, KosCard, etc.)
- `src/data/kos.ts` — static data source (no DB/API yet)
- `public/` — static assets
- Path alias: `@/*` → `src/*` (`tsconfig.json:22`)

## Conventions

- Styling: Tailwind CSS 4 via `@tailwindcss/postcss` + `@import "tailwindcss"` in `src/app/globals.css`. Theme tokens defined as CSS variables in `globals.css` (`--primary`, `--accent`, etc.) and exposed via `@theme inline`.
- Fonts: `next/font/google` — Geist + Rubik (`src/app/layout.tsx:5`), exposed as CSS variables.
- ESLint ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts` (see `eslint.config.mjs`).
- Language: UI/content is Indonesian (`lang="id"` in layout, kos domain terminology).
