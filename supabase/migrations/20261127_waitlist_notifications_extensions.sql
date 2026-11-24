-- Waitlist offers, in-app notifications, and renter extension requests.
-- Existing waitlist.tanggal_mulai remains the renter's requested minimum date.

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS slot_mulai date,
  ADD COLUMN IF NOT EXISTS ditawarkan_at timestamptz,
  ADD COLUMN IF NOT EXISTS berlaku_sampai timestamptz,
  ADD COLUMN IF NOT EXISTS pemesanan_id uuid;

ALTER TABLE public.pemesanan
  ADD COLUMN IF NOT EXISTS waitlist_id uuid;

CREATE TABLE IF NOT EXISTS public.notifikasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  jenis text NOT NULL,
  judul text NOT NULL,
  isi text NOT NULL,
  href text,
  dibaca_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifikasi FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark own notifications read" ON public.notifikasi FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service can create notifications" ON public.notifikasi FOR INSERT WITH CHECK (auth.uid() = user_id);
GRANT SELECT, UPDATE ON public.notifikasi TO authenticated;

CREATE TABLE IF NOT EXISTS public.pengajuan_perpanjangan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pemesanan_id uuid NOT NULL,
  user_id uuid NOT NULL,
  tambahan_bulan integer NOT NULL CHECK (tambahan_bulan BETWEEN 1 AND 24),
  status text NOT NULL DEFAULT 'menunggu',
  diproses_oleh uuid,
  diproses_at timestamptz,
  alasan_tolak text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pengajuan_perpanjangan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Renters can create own extensions" ON public.pengajuan_perpanjangan FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Renters can view own extensions" ON public.pengajuan_perpanjangan FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can view extensions for own kos" ON public.pengajuan_perpanjangan FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pemesanan p JOIN public.kos k ON k.id_kos = p.kos_id WHERE p.id = pemesanan_id AND k.id_pemilik = auth.uid())
);
CREATE POLICY "Owners can decide extensions for own kos" ON public.pengajuan_perpanjangan FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.pemesanan p JOIN public.kos k ON k.id_kos = p.kos_id WHERE p.id = pemesanan_id AND k.id_pemilik = auth.uid())
);
GRANT SELECT, INSERT, UPDATE ON public.pengajuan_perpanjangan TO authenticated;
