-- Alur pemesanan kos: konfirmasi pemesanan menurunkan stok kamar secara atomic.
-- Sumber kebenaran ketersediaan kamar adalah stok (stok > 0 => Tersedia, else Penuh).
-- Fungsi ini memastikan cek status 'menunggu' + decrement stok + update status
-- terjadi dalam satu transaksi, sehingga tidak ada race condition saat dua pemilik
-- (atau dua tab) mencoba mengonfirmasi pemesanan untuk kamar terakhir.

create or replace function public.konfirmasi_pemesanan(p_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_kamar_id uuid;
begin
  select status, kamar_id into v_status, v_kamar_id
  from public.pemesanan
  where id = p_id;

  if not found then
    return 'not_found';
  end if;

  if v_status <> 'menunggu' then
    return 'already_processed';
  end if;

  update public.kamar
     set stok = stok - 1,
         ketersediaan = case when stok - 1 > 0 then 'Tersedia' else 'Penuh' end
   where id = v_kamar_id
     and stok > 0;

  if not found then
    return 'stok_habis';
  end if;

  update public.pemesanan
     set status = 'dikonfirmasi'
   where id = p_id;

  return 'ok';
end;
$$;

-- Pemilik (atau admin) yang sudah diverifikasi bisa memanggil RPC ini;
-- RLS tetap menolak akses anon/auth langsung ke RPC yang berbahaya, karena
-- pemanggilan dilakukan lewat server action setelah auth + otorisasi sudah dicek.
revoke all on function public.konfirmasi_pemesanan(uuid) from public;
grant execute on function public.konfirmasi_pemesanan(uuid) to authenticated;
