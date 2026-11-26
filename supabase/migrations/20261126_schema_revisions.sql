-- Schema revisions:
-- 1. Rename kos_fasilitas -> detail_kos with kamar_id
-- 2. Create ulasan table linked to pemesanan with rating sync trigger
-- 3. Add diverifikasi_oleh & diverifikasi_at to profiles and drop pengajuan_pemilik

-- 1. Rename kos_fasilitas -> detail_kos and add kamar_id
ALTER TABLE public.kos_fasilitas RENAME TO detail_kos;
ALTER TABLE public.detail_kos ADD COLUMN IF NOT EXISTS kamar_id uuid;

ALTER POLICY kosfasilitas_admin_all ON public.detail_kos RENAME TO detail_kos_admin_all;
ALTER POLICY kosfasilitas_owner_all ON public.detail_kos RENAME TO detail_kos_owner_all;
ALTER POLICY kosfasilitas_tayang_read ON public.detail_kos RENAME TO detail_kos_tayang_read;

CREATE INDEX IF NOT EXISTS idx_detail_kos_kos_id ON public.detail_kos (kos_id);
CREATE INDEX IF NOT EXISTS idx_detail_kos_kamar_id ON public.detail_kos (kamar_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_detail_kos_unique_mapping
  ON public.detail_kos (kos_id, COALESCE(kamar_id, '00000000-0000-0000-0000-000000000000'::uuid), fasilitas_id);

-- 2. Create ulasan table + RLS + rating sync trigger
CREATE TABLE IF NOT EXISTS public.ulasan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pemesanan_id uuid NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  kos_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  komentar text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ulasan_kos_id ON public.ulasan (kos_id);
CREATE INDEX IF NOT EXISTS idx_ulasan_user_id ON public.ulasan (user_id);

ALTER TABLE public.ulasan ENABLE ROW LEVEL SECURITY;

CREATE POLICY ulasan_admin_all ON public.ulasan
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY ulasan_tayang_read ON public.ulasan
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.kos k
    WHERE k.id_kos = ulasan.kos_id AND k.status_publikasi = 'tayang'
  ));

CREATE POLICY ulasan_select_own ON public.ulasan
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY ulasan_insert_own ON public.ulasan
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.pemesanan p
      WHERE p.id = ulasan.pemesanan_id
        AND p.user_id = auth.uid()
        AND p.kos_id = ulasan.kos_id
        AND p.status = 'dikonfirmasi'
        AND p.tanggal_mulai <= CURRENT_DATE
    )
  );

CREATE POLICY ulasan_update_own ON public.ulasan
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY ulasan_delete_own ON public.ulasan
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_kos_rating_from_ulasan()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kos_id uuid;
BEGIN
  v_kos_id := COALESCE(NEW.kos_id, OLD.kos_id);

  UPDATE public.kos k
  SET
    rating = COALESCE((SELECT ROUND(AVG(u.rating)::numeric, 2) FROM public.ulasan u WHERE u.kos_id = v_kos_id), 0),
    ulasan = (SELECT COUNT(*) FROM public.ulasan u WHERE u.kos_id = v_kos_id)
  WHERE k.id_kos = v_kos_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_kos_rating ON public.ulasan;
CREATE TRIGGER trg_sync_kos_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.ulasan
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_kos_rating_from_ulasan();

-- 3. Add verification columns to profiles & drop pengajuan_pemilik
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS diverifikasi_oleh uuid,
  ADD COLUMN IF NOT EXISTS diverifikasi_at timestamptz;

CREATE POLICY profiles_admin_all ON public.profiles
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP FUNCTION IF EXISTS public.approve_pengajuan_pemilik(uuid);
DROP TABLE IF EXISTS public.pengajuan_pemilik;
