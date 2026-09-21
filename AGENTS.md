<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KosEase

Next 16.3.3 (Turbopack) + React 19.2.8 + TypeScript + Tailwind CSS 4. Single package, no monorepo.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (`next build`)
- `npm start` — serve production build
- `npm run lint` — ESLint only (flat config, `eslint-config-next` core-web-vitals + typescript). **No typecheck command configured.**

No test runner, no CI workflows, no pre-commit hooks configured.

## Project Structure

- `src/app/` — App Router routes (`page.tsx`, `layout.tsx`, `kos/[id]/page.tsx`, `kos/layout.tsx`, `cari-kos/`, `dashboard/`, `login/`, `register/`)
- `src/app/kos/layout.tsx` — wraps all `/kos/*` pages with `NavbarWrapper` (server component)
- `src/app/pemesanan/page.tsx` — booking page (server, reads `searchParams.kosId`)
- `src/app/pemesanan/PemesananForm.tsx` — booking form (client, holds all form state)
- `src/app/(auth)/actions.ts` — server actions: `registerAction`, `loginAction`, `logoutAction`, `forgotPasswordAction`, `resetPasswordAction`, `updateProfileAction`
- `src/app/dashboard/profil/page.tsx` — profile page (server, fetches user + profiles)
- `src/components/` — shared UI: `Navbar`, `NavbarWrapper`, `Footer`, `ProfileForm`, `DashboardNavbar`, `DashboardSidebarUser`, `DashboardSidebarUserWrapper`, `LogoutButton`
- `src/data/kos.ts` — static data source: `kosList` (6 kos), `TipeKamar` has field `deskripsi: string`
- `src/lib/supabase/` — `client.ts` (client-side), `server.ts` (server-side)
- `public/img/` — static assets; `avatar-default.png` is the default avatar fallback
- Path alias: `@/*` → `src/*` (`tsconfig.json:22`)

## Conventions

- Styling: Tailwind CSS 4 via `@tailwindcss/postcss` + `@import "tailwindcss"` in `src/app/globals.css`. Theme tokens defined as CSS variables in `globals.css` (`--primary`, `--accent`, etc.) and exposed via `@theme inline`.
- Fonts: `next/font/google` — Geist + Rubik (`src/app/layout.tsx:5`), exposed as CSS variables.
- ESLint ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts` (see `eslint.config.mjs`).
- Language: UI/content is Indonesian (`lang="id"` in layout, kos domain terminology).
- `CLAUDE.md` just contains `@AGENTS.md` — AGENTS.md is the single instruction source.

## Supabase

- Project URL: `https://tbgvoahqynwsiqfrqkem.supabase.co`
- Auth: `@supabase/ssr` + `zod` validation
- Storage bucket: `avatars` (user avatar uploads)
- `next.config.ts` has `images.remotePatterns` for `tbgvoahqynwsiqfrqkem.supabase.co/storage/v1/avatars/**` — **required for `<Image>` to render uploaded avatars**
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. There is a TODO comment about rotating the anon key. `SUPABASE_SERVICE_ROLE_KEY` is server-side only.

## Auth & Roles

- 3 roles: `penyewa` (user), `pemilik` (kos owner), `admin`
- `NavbarWrapper` (server component) fetches user from `auth.getUser()` + `profiles` table — **2 sequential Supabase queries per page**
- `middleware.ts` protects `/dashboard/:path*`
- **Deprecated**: `middleware.ts` filename is deprecated in Next 16.3.3. Migrate via: `npx @next/codemod@canary middleware-to-proxy .`

## Avatar Handling

- Default fallback: `/img/avatar-default.png` (exists in `public/img/`)
- `NavbarWrapper.tsx` fetches `avatar_url` from `profiles` table; passes `avatarUrl` to `Navbar`, `DashboardNavbar`, `DashboardSidebarUser`
- All navbar/dashboard components render `<Image src={avatarUrl ?? "/img/avatar-default.png"}>` — no `IconUser` fallback in avatar display positions

## Booking Flow

- `pemesanan/page.tsx` (server) reads `searchParams.kosId`, finds kos from `kosList`, passes `kos` prop to `PemesananForm`
- `PemesananForm.tsx` (client, `"use client"`) holds all state: `selectedKamar`, `durasi`, `nama`, `wa`, `tanggal`, `catatan`
- Dropdown shows kamar names only; `harga` and `stok` shown in ringkasan card on the right

## Other Notes

- `PRD.md` exists at root but is in `.gitignore` — not committed to repo
- `src/data/kos.ts` is the only data source; no real DB/API layer yet for kos listing (Supabase used for auth, profiles, storage)
