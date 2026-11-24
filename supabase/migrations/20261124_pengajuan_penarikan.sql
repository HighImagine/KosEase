-- Alur penarikan kos: pemilik mengajukan alasan, admin menyetujui/menolak.
-- Tanpa FK (mengikuti kesepakatan skema):
--   kos_id     -> public.kos.id_kos
--   id_pemilik -> public.profiles.id
-- Status: menunggu -> disetujui | ditolak. Persetujuan admin yang mengubah
-- status_publikasi kos menjadi 'draft' (pemilik non-admin tidak boleh langsung).
CREATE TABLE IF NOT EXISTS public.pengajuan_penarikan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kos_id uuid NOT NULL,
  id_pemilik uuid NOT NULL,
  alasan text NOT NULL,
  status text NOT NULL DEFAULT 'menunggu'
    CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
  diproses_oleh uuid,
  diproses_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pengajuan_penarikan_kos_id_idx ON public.pengajuan_penarikan (kos_id);
CREATE INDEX IF NOT EXISTS pengajuan_penarikan_status_idx ON public.pengajuan_penarikan (status);

-- Satu kos hanya boleh punya satu pengajuan yang masih menunggu.
CREATE UNIQUE INDEX IF NOT EXISTS pengajuan_penarikan_pending_unique
  ON public.pengajuan_penarikan (kos_id)
  WHERE status = 'menunggu';

ALTER TABLE public.pengajuan_penarikan ENABLE ROW LEVEL SECURITY;

-- Pemilik: lihat pengajuan miliknya sendiri.
DROP POLICY IF EXISTS "Pemilik dapat melihat pengajuan penarikan miliknya" ON public.pengajuan_penarikan;
CREATE POLICY "Pemilik dapat melihat pengajuan penarikan miliknya" ON public.pengajuan_penarikan
  FOR SELECT USING (id_pemilik = auth.uid());

-- Pemilik: hanya boleh mengajukan untuk kos miliknya, dan selalu berstatus menunggu.
DROP POLICY IF EXISTS "Pemilik dapat mengajukan penarikan kos miliknya" ON public.pengajuan_penarikan;
CREATE POLICY "Pemilik dapat mengajukan penarikan kos miliknya" ON public.pengajuan_penarikan
  FOR INSERT WITH CHECK (
    id_pemilik = auth.uid()
    AND status = 'menunggu'
    AND diproses_oleh IS NULL
    AND diproses_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.kos k
      WHERE k.id_kos = kos_id AND k.id_pemilik = auth.uid()
    )
  );

-- Admin: lihat semua pengajuan.
DROP POLICY IF EXISTS "Admin dapat melihat semua pengajuan penarikan" ON public.pengajuan_penarikan;
CREATE POLICY "Admin dapat melihat semua pengajuan penarikan" ON public.pengajuan_penarikan
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admin: proses (setujui/tolak) pengajuan.
DROP POLICY IF EXISTS "Admin dapat memperbarui pengajuan penarikan" ON public.pengajuan_penarikan;
CREATE POLICY "Admin dapat memperbarui pengajuan penarikan" ON public.pengajuan_penarikan
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.pengajuan_penarikan TO authenticated;
