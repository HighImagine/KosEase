-- Add owner application fields directly to public.profiles (Option 1: no pengajuan_pemilik table)
-- Keeps column-level UPDATE restriction from 20261120_approve_owner_application.sql intact
-- by routing submissions and admin reviews through SECURITY DEFINER RPCs.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status_verifikasi text,
  ADD COLUMN IF NOT EXISTS dokumen_url text,
  ADD COLUMN IF NOT EXISTS info_pengajuan jsonb;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_status_verifikasi_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_status_verifikasi_check
  CHECK (
    status_verifikasi IS NULL
    OR status_verifikasi = ANY (ARRAY['menunggu_verifikasi'::text, 'disetujui'::text, 'ditolak'::text])
  );

CREATE INDEX IF NOT EXISTS idx_profiles_status_verifikasi
  ON public.profiles (status_verifikasi)
  WHERE status_verifikasi IS NOT NULL;

-- 1. Penyewa submits owner application into their own profiles row
CREATE OR REPLACE FUNCTION public.submit_pengajuan_pemilik(
  p_nama text,
  p_no_hp text,
  p_alamat text,
  p_alasan text,
  p_info_kos text,
  p_dokumen_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Harus masuk untuk mengajukan diri';
  END IF;

  UPDATE public.profiles
  SET
    status_verifikasi = 'menunggu_verifikasi',
    dokumen_url = COALESCE(p_dokumen_url, dokumen_url),
    info_pengajuan = jsonb_build_object(
      'nama_lengkap', p_nama,
      'no_hp', p_no_hp,
      'alamat', p_alamat,
      'alasan', p_alasan,
      'info_kos', p_info_kos,
      'diajukan_at', now()
    )
  WHERE id = v_uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil pengguna tidak ditemukan';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_pengajuan_pemilik(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_pengajuan_pemilik(text, text, text, text, text, text) TO authenticated;

-- 2. Admin approves or rejects an owner application on profiles
CREATE OR REPLACE FUNCTION public.admin_review_pengajuan_pemilik(
  p_user_id uuid,
  p_action text,
  p_alasan_tolak text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
BEGIN
  IF v_admin IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Hanya admin yang dapat memproses pengajuan';
  END IF;

  IF p_action = 'disetujui' THEN
    UPDATE public.profiles
    SET
      role = 'pemilik',
      status_verifikasi = 'disetujui',
      diverifikasi_oleh = v_admin,
      diverifikasi_at = now()
    WHERE id = p_user_id
      AND status_verifikasi = 'menunggu_verifikasi';
  ELSIF p_action = 'ditolak' THEN
    UPDATE public.profiles
    SET
      status_verifikasi = 'ditolak',
      diverifikasi_oleh = v_admin,
      diverifikasi_at = now(),
      info_pengajuan = COALESCE(info_pengajuan, '{}'::jsonb) || jsonb_build_object('alasan_tolak', COALESCE(NULLIF(p_alasan_tolak, ''), 'Ditolak oleh admin'))
    WHERE id = p_user_id
      AND status_verifikasi = 'menunggu_verifikasi';
  ELSE
    RAISE EXCEPTION 'Aksi tidak valid: %', p_action;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan tidak ditemukan atau sudah diproses';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_review_pengajuan_pemilik(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_review_pengajuan_pemilik(uuid, text, text) TO authenticated;

-- 3. Admin directly updates user role from Kelola Pengguna
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id uuid,
  p_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin uuid := auth.uid();
BEGIN
  IF v_admin IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Hanya admin yang dapat mengubah peran pengguna';
  END IF;

  IF p_role NOT IN ('penyewa', 'pemilik', 'admin') THEN
    RAISE EXCEPTION 'Peran tidak valid: %', p_role;
  END IF;

  UPDATE public.profiles
  SET
    role = p_role,
    diverifikasi_oleh = CASE WHEN p_role = 'pemilik' THEN v_admin ELSE NULL END,
    diverifikasi_at = CASE WHEN p_role = 'pemilik' THEN now() ELSE NULL END
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengguna tidak ditemukan';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(uuid, text) TO authenticated;
