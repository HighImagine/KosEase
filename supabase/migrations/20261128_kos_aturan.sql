-- Aturan kos: daftar key aturan yang dipilih pemilik (checkbox) + kapasitas
-- maksimal penghuni per kamar. Key divalidasi di aplikasi (src/lib/aturan.ts),
-- bukan lewat constraint agar daftar aturan bisa berkembang tanpa migrasi baru.

ALTER TABLE public.kos
  ADD COLUMN IF NOT EXISTS aturan text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS maks_penghuni integer;

ALTER TABLE public.kos
  DROP CONSTRAINT IF EXISTS kos_maks_penghuni_check;

ALTER TABLE public.kos
  ADD CONSTRAINT kos_maks_penghuni_check
  CHECK (maks_penghuni IS NULL OR (maks_penghuni >= 1 AND maks_penghuni <= 20));
