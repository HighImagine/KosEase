-- ERD hardening: default kolom, CHECK constraint, index, RLS, dan RPC kartu pemilik.
-- Semua perubahan sudah diverifikasi aman terhadap data existing (tidak ada
-- nilai yang melanggar constraint / duplikat / NULL pada kolom yang diwajibkan).

-- ---------------------------------------------------------------------------
-- 1. Default kolom yang salah (sebelumnya literal 'NOT NULL', 'NULL', 'unique',
--    dan '"Tersedia"' dengan tanda kutip).
-- ---------------------------------------------------------------------------
alter table public.profiles alter column full_name set default '';
alter table public.profiles alter column role set default 'penyewa';

alter table public.fasilitas alter column nama drop default;
alter table public.fasilitas alter column nama set not null;

alter table public.kamar alter column ketersediaan set default 'Tersedia';
alter table public.kos alter column status_publikasi set default 'draft';

-- ---------------------------------------------------------------------------
-- 2. Tipe uang seragam: total_harga mengikuti kos.harga/kamar.harga (bigint).
-- ---------------------------------------------------------------------------
alter table public.pemesanan alter column total_harga type bigint;

-- ---------------------------------------------------------------------------
-- 3. CHECK constraint untuk enum status yang sebelumnya hanya dijaga kode.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kos_status_publikasi_check') then
    alter table public.kos
      add constraint kos_status_publikasi_check
      check (status_publikasi in ('draft', 'tayang'));
  end if;
  
  if not exists (select 1 from pg_constraint where conname = 'kos_tipe_check') then
    alter table public.kos
      add constraint kos_tipe_check
      check (tipe in ('Campur', 'Laki-laki', 'Perempuan'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('penyewa', 'pemilik', 'pemilik_kos', 'admin'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'waitlist_status_check') then
    alter table public.waitlist
      add constraint waitlist_status_check
      check (status in ('menunggu', 'ditawarkan', 'diklaim', 'selesai', 'dibatalkan', 'kedaluwarsa'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'waitlist_durasi_check') then
    alter table public.waitlist
      add constraint waitlist_durasi_check
      check (durasi between 1 and 24);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pengajuan_perpanjangan_status_check') then
    alter table public.pengajuan_perpanjangan
      add constraint pengajuan_perpanjangan_status_check
      check (status in ('menunggu', 'disetujui', 'ditolak'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'notifikasi_jenis_check') then
    alter table public.notifikasi
      add constraint notifikasi_jenis_check
      check (jenis in ('waitlist', 'perpanjangan', 'pemesanan', 'sistem'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pemesanan_durasi_max_check') then
    alter table public.pemesanan
      add constraint pemesanan_durasi_max_check
      check (durasi <= 24);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'pemesanan_total_harga_check') then
    alter table public.pemesanan
      add constraint pemesanan_total_harga_check
      check (total_harga >= 0);
  end if;
end $$;

-- Nama fasilitas wajib unik (master data).
create unique index if not exists fasilitas_nama_key on public.fasilitas (nama);

-- Satu tawaran waitlist hanya boleh menghasilkan satu pemesanan, dan sebaliknya.
create unique index if not exists waitlist_pemesanan_id_key
  on public.waitlist (pemesanan_id) where pemesanan_id is not null;
create unique index if not exists pemesanan_waitlist_id_key
  on public.pemesanan (waitlist_id) where waitlist_id is not null;

-- ---------------------------------------------------------------------------
-- 4. Bersihkan sisa desain lama: detail_kos.kamar_id tidak pernah dipakai dan
--    unique (kos_id, fasilitas_id) memang menjadikan fasilitas level kos.
-- ---------------------------------------------------------------------------
alter table public.detail_kos drop column if exists kamar_id;

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'kos_fasilitas_kos_id_fasilitas_id_key') then
    alter table public.detail_kos
      rename constraint kos_fasilitas_kos_id_fasilitas_id_key to detail_kos_kos_id_fasilitas_id_key;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Index untuk query yang paling sering dipakai.
-- ---------------------------------------------------------------------------
create index if not exists idx_kos_pemilik on public.kos (id_pemilik);
create index if not exists idx_kos_status on public.kos (status_publikasi, created_at desc);
create index if not exists idx_kamar_kos on public.kamar (kos_id);
create index if not exists idx_galeri_kos on public.galeri (kos_id, created_at);
create index if not exists idx_detail_kos_kos on public.detail_kos (kos_id);
create index if not exists idx_pemesanan_user on public.pemesanan (user_id, created_at desc);
create index if not exists idx_pemesanan_kos_status on public.pemesanan (kos_id, status);
create index if not exists idx_pemesanan_kamar on public.pemesanan (kamar_id);
create index if not exists idx_waitlist_kamar_status on public.waitlist (kamar_id, status, created_at);
create index if not exists idx_waitlist_user on public.waitlist (user_id, status);
create index if not exists idx_notifikasi_user on public.notifikasi (user_id, dibaca_at, created_at desc);
create index if not exists idx_perpanjangan_status on public.pengajuan_perpanjangan (status, created_at);
create index if not exists idx_penarikan_status on public.pengajuan_penarikan (status, created_at);
create index if not exists idx_ulasan_kos on public.ulasan (kos_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 6. Registrasi: full_name NOT NULL tidak boleh diisi NULL dari metadata kosong.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(new.email, '@', 1),
      'Pengguna'
    ),
    'penyewa'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Kartu "Dikelola oleh" untuk pengunjung anonim: hanya nama + avatar.
--    Menggantikan policy lama yang membuka SELURUH baris profiles ke semua
--    user login (termasuk phone, dokumen_url, info_pengajuan).
-- ---------------------------------------------------------------------------
create or replace function public.get_kos_owner(p_id uuid)
returns table (nama text, avatar text)
language sql
stable
security definer
set search_path = public
as $$
  select p.full_name, p.avatar_url
  from public.profiles p
  where p.id = p_id
  limit 1;
$$;

revoke all on function public.get_kos_owner(uuid) from public;
grant execute on function public.get_kos_owner(uuid) to anon, authenticated;

drop policy if exists "Authenticated users can view profiles" on public.profiles;
drop policy if exists "Public can view profiles" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Admin tetap memakai profiles_admin_all (is_admin()).

-- ---------------------------------------------------------------------------
-- 8. Pengajuan penarikan: admin boleh menghapus (dipakai saat pembersihan kos).
-- ---------------------------------------------------------------------------
drop policy if exists penarikan_admin_delete on public.pengajuan_penarikan;
create policy penarikan_admin_delete on public.pengajuan_penarikan
  for delete using (public.is_admin());
