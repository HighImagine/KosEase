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
- `src/app/kos/actions.ts` — CRUD kos/kamar/galeri/fasilitas: `createKosAction`, `updateKosAction`, `setPublikasiAction`, `deleteKosAction` (hapus manual berurutan, tanpa cascade), `upsertKamarAction`, `deleteKamarAction`, `setKosFasilitasAction`, `uploadGaleriAction`, `deleteGaleriAction`
- `src/app/dashboard/profil/page.tsx` — profile page (server, fetches user + profiles)
- `src/app/dashboard/pemilik/kos/` — kelola kos pemilik: `page.tsx` (daftar), `tambah/page.tsx`, `[id]/page.tsx` (edit + `KamarManager`, `GaleriManager`, `FasilitasPicker`), `KosForm.tsx`, `KosListActions.tsx`
- `src/app/dashboard/admin/kos/page.tsx` — moderasi semua kos (takedown = set `draft`)
- `src/lib/db/` — `types.ts` (tipe baris DB 1:1 dengan kolom SQL), `queries.ts` (baca publik/owner/admin), `compat.ts` (fallback `kosList` saat tabel kosong — hapus setelah data produksi terisi)
- `src/lib/format.ts` — `formatHarga` (jangan import dari `@/data/kos` di kode baru)
- `src/proxy.ts` — TUNGGAL untuk next-intl + auth guard; matcher luas next-intl (`/((?!api|trpc|_next|_vercel|.*\..*).*)`). Guard kupas prefix `/id|/en` dulu (`stripLocale`), redirect SELALU bawa prefix. Cookie sesi ditempel ke respons intl (`applyCookies`)
- `src/i18n/` — `routing.ts` (`locales: [id,en]`, `localePrefix: "always"`, default `id`), `navigation.ts` (WAJIB untuk semua Link/redirect/router client), `request.ts`
- `messages/{id,en}.json` — katalog string (~35 namespace); EN diterjemahkan AI, perlu koreksi manusia
- Switcher bahasa di 4 titik: seksi "Bahasa" di dropdown avatar (`Navbar.tsx`, `router.replace` halaman sama — tanpa entri history), `SidebarLanguageSwitcher` di 3 sidebar, pil `LanguageSwitcher` hanya di Footer (dihapus dari navbar agar tak duplikat)
- `src/lib/locale.ts` — `withLocale(path, locale)` + `formLocale(fd)` untuk redirect di server actions (redirect next-intl tidak dijamin di actions → pakai `next/navigation` + path berprefix)
- Semua route di `src/app/[locale]/...`; root `app/layout.tsx` hanya passthrough (html/lang di `[locale]/layout.tsx` + `NextIntlClientProvider` + `setRequestLocale` + `generateStaticParams`)
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

- DB roles: `penyewa`, `pemilik`, `pemilik_kos` (keduanya pemilik), `admin`. Redirect login di `actions.ts:66-71`: pemilik → `/dashboard`, lainnya → `/`
- `NavbarWrapper` (server component) fetches user from `auth.getUser()` + `profiles` table — **2 sequential Supabase queries per page**
- Route guard: `src/proxy.ts` (bukan `middleware.ts` — tidak ada file itu). Belum login + akses `/dashboard/*` → redirect `/login?next=...`; `/dashboard/admin/*` wajib role `admin`. Halaman `/admin` (login admin) itu PUBLIK — jangan ikut dijaga (pernah bug ayam-telur)
- Sidebar: `DashboardSidebarUserWrapper` otomatis pakai sidebar sesuai role — `AdminSidebar` bila admin (menu: Beranda, Kembali ke Website, Kelola Pengguna, Verifikasi Pemilik Kos, Moderasi Publikasi Kos + Keluar merah). Model moderasi: pemilik langsung tayang, admin takedown reaktif via `draft` (bukan approval), `PemilikSidebar` bila pemilik (menu: Beranda, Kembali ke Website, Kelola Kos, Kelola Kamar + profil-link + Keluar merah), selain itu `DashboardSidebarUser`. Desain acuan: `public/img/sidebar-ds-admin.png`
- `/dashboard/pemilik/kamar` = daftar semua kamar milik pemilik (baca saja + link ke halaman kos; tambah/edit/hapus tetap di `[id]` kos)
- Login admin mendarat di `/dashboard/admin` (Beranda admin: snapshot + 3 preview padat); `/dashboard/admin/pengguna` masih placeholder

## Database (Supabase, schema `public`)

- 6 tabel, **tanpa FK constraint** (kesepakatan): `kos` (`id_kos` uuid PK, `id_pemilik` uuid → `profiles.id`), `kamar` + `galeri` (punya `kos_id` uuid), `fasilitas` (master: `id, nama, created_at`), `kos_fasilitas` (relasi: `kos_id, fasilitas_id`), `pengajuan_pemilik` (`id, user_id, nama_lengkap, no_hp, alamat, alasan, info_kos, status, diverifikasi_oleh, diverifikasi_at, alasan_tolak, dokumen_url, created_at` — nama kolom ERD, beda dari nama field form `nama`/`phone`)
- Selalu tulis skema lengkap dengan tipe data saat diskusi DB dengan user
- RLS: publik baca hanya `status_publikasi='tayang'` (plus anaknya via `EXISTS` ke `kos`); tulis hanya `id_pemilik = auth.uid()` atau `is_admin()`; `fasilitas` tulis-admin-saja. Bucket: `avatars` + `kos-foto` (public read), `dokumen-pengajuan` (**private** — KTP; baca via signed URL 1 jam, hanya owner + admin). `pengajuan_pemilik_kos.dokumen_url` menyimpan storage *path*, bukan URL
- Konsekuensi tanpa cascade: `deleteKosAction` hapus manual berurutan (file bucket → `galeri` → `kamar` → `kos_fasilitas` → `kos`)
- `kos.harga` = min harga kamar, dihitung ulang (`recalcHargaMin`) setiap kamar berubah; `kamar.ketersediaan` ditulis kode (`stok > 0 ? Tersedia : Penuh`)
- Halaman baca (home, cari-kos, `kos/[id]`, pemesanan) query DB dulu, fallback ke `kosList` bila kosong (`compat.ts`); `kosId` kini uuid string (fallback numerik lama tetap didukung)
- `/dashboard/{reservasi,status,riwayat}` = shell jujur (empty state, tanpa data). Backend booking belum ada (`PemesananForm` masih `alert()` stub). Saat dibangun: tabel `pemesanan` (`id, user_id, kos_id, kamar_id, tanggal_mulai, durasi, total, status, created_at`) + submit simpan beneran → 3 halaman tinggal ganti empty state dengan query. Blok reservasi di `/dashboard` hanya untuk penyewa; pemilik nanti dapat panel sendiri **"Reservasi Masuk"** (pemesan kos miliknya)

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
- `src/data/kos.ts` tersisa sebagai fallback + helper murni (`tipeStyles`, `getKetersediaanStatus`, `statusStyles`); sumber baca utama kini Supabase
- Plain `<form action={fn}>` untuk server action 2-argumen tidak lolos typecheck — bungkus: `action={async (fd: FormData) => { await fn(null, fd); }}` (lihat `KosListActions.tsx`), jangan `as any`. Inline wrapper HANYA di Client Component; di Server Component action harus referensi langsung
- String UI baru WAJIB masuk `messages/id.json` + `en.json` (key hilang = runtime error next-intl). Pesan zod/error actions + isi DB (nama/deskripsi kos) masih Indonesia — Fase 2
- `revalidatePath` HARUS per locale: pakai `revalidateKosPages()` di `kos/actions.ts` (revalidasi `/id` dan `/en` sekaligus)
- `useSearchParams`/`notFound`/plain `redirect` tetap dari `next/navigation`; sisanya dari `@/i18n/navigation`
- `next.config.ts` `images.remotePatterns` mencakup `.../storage/v1/object/public/kos-foto/**` — wajib untuk render foto galeri via `<Image>`
