-- Alasan penolakan reservasi oleh pemilik kos.
-- Disimpan sebagai key terstruktur (+ teks custom hanya untuk "lainnya")
-- supaya alasan bisa diterjemahkan saat ditampilkan (bahasa penerima tidak
-- bergantung pada bahasa UI pemilik saat menolak) dan bisa difilter/diagregasi.

alter table public.pemesanan
  add column if not exists alasan_key text,
  add column if not exists alasan_custom text,
  add column if not exists ditolak_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.pemesanan'::regclass
      and conname = 'pemesanan_alasan_key_check'
  ) then
    alter table public.pemesanan
      add constraint pemesanan_alasan_key_check
      check (
        alasan_key is null
        or alasan_key in ('penuh', 'tanggal', 'data', 'renovasi', 'lainnya')
      );
  end if;
end $$;

comment on column public.pemesanan.alasan_key is
  'Key alasan penolakan: penuh | tanggal | data | renovasi | lainnya';
comment on column public.pemesanan.alasan_custom is
  'Teks bebas, hanya diisi saat alasan_key = lainnya (maks 200 karakter, divalidasi di server action)';
comment on column public.pemesanan.ditolak_at is
  'Waktu pemilik/admin menolak reservasi';
