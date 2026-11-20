-- Persetujuan pemilik harus atomik: role tidak boleh berubah tanpa pengajuan
-- disetujui, dan pengajuan tidak boleh disetujui tanpa perubahan role.
-- Fungsi ini berjalan dengan hak pemilik database, tetapi tetap memverifikasi
-- identitas admin dari JWT pemanggil.
CREATE OR REPLACE FUNCTION public.approve_pengajuan_pemilik(p_pengajuan_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Hanya admin yang dapat menyetujui pengajuan';
  END IF;

  SELECT user_id
  INTO v_user_id
  FROM public.pengajuan_pemilik
  WHERE id = p_pengajuan_id
    AND status = 'menunggu_verifikasi'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pengajuan tidak ditemukan atau sudah diproses';
  END IF;

  UPDATE public.profiles
  SET role = 'pemilik'
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profil pemohon tidak ditemukan';
  END IF;

  UPDATE public.pengajuan_pemilik
  SET status = 'disetujui',
      diverifikasi_oleh = auth.uid(),
      diverifikasi_at = now()
  WHERE id = p_pengajuan_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_pengajuan_pemilik(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_pengajuan_pemilik(uuid) TO authenticated;

-- Pengguna hanya boleh mengubah data profil pribadi yang memang diedit oleh UI.
-- Perubahan role eksklusif melalui fungsi persetujuan di atas.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, avatar_url, phone) ON public.profiles TO authenticated;
