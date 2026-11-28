-- Selaraskan GRANT tabel dengan policy RLS yang sudah ada.
-- Tanpa ini beberapa alur tidak pernah bisa jalan (RLS lolos, tapi privilege
-- tabel ditolak): update profil sendiri, hapus pengajuan penarikan oleh admin,
-- dan seluruh akses tabel ulasan.

grant update on public.profiles to authenticated;

-- Policy penarikan_admin_delete hanya berguna bila role authenticated punya
-- privilege DELETE (RLS tetap membatasi ke admin).
grant delete on public.pengajuan_penarikan to authenticated;

-- Ulasan: baca publik hanya untuk kos tayang (policy), tulis hanya pemilik
-- ulasan (policy). Sebelumnya authenticated tidak punya privilege sama sekali.
grant select on public.ulasan to anon, authenticated;
grant insert, update, delete on public.ulasan to authenticated;
