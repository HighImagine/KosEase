-- Antrian waitlist penyewaan kos. Dipakai saat kos/kamar sudah penuh:
-- penyewa tidak bisa langsung booking, sebaliknya masuk antrian.

CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kos_id uuid NOT NULL,
  kamar_id uuid NOT NULL,
  nama text NOT NULL,
  no_wa text NOT NULL,
  tanggal_mulai date NOT NULL,
  durasi int NOT NULL DEFAULT 3,
  catatan text,
  status text NOT NULL DEFAULT 'menunggu', -- menunggu | diproses | dibatalkan
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Pembuat antrian bebas memasukkan untuk akun sendiri.
CREATE POLICY "Users can insert own waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pembuat antrian bisa melihat antriannya sendiri.
CREATE POLICY "Users can view own waitlist" ON public.waitlist
  FOR SELECT USING (auth.uid() = user_id);

-- Owner kos bisa melihat antrian untuk kosnya.
CREATE POLICY "Owners can view waitlist of their kos" ON public.waitlist
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.kos k
      WHERE k.id_kos = waitlist.kos_id AND k.id_pemilik = auth.uid()
    )
  );

-- Admin bisa melihat semua antrian.
CREATE POLICY "Admins can view all waitlist" ON public.waitlist
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Owner pemilik kos bisa mengubah status antriannya (proses/tolak).
CREATE POLICY "Owners can update their kos waitlist" ON public.waitlist
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.kos k
      WHERE k.id_kos = waitlist.kos_id AND k.id_pemilik = auth.uid()
    )
  );

GRANT SELECT, INSERT, UPDATE ON public.waitlist TO authenticated;
