-- Guard integritas pemesanan di level database.
-- Aplikasi sudah memvalidasi, tetapi RLS hanya row-level: tanpa guard ini user
-- bisa memanggil Supabase langsung untuk insert status 'dikonfirmasi' atau
-- total_harga arbitrer, dan pemilik bisa "mengonfirmasi" tanpa potong stok.

create or replace function public.enforce_pemesanan_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_harga bigint;
begin
  -- Service role (auth.uid() null) dan admin boleh melewati guard.
  if auth.uid() is not null and not public.is_admin() then
    select k.harga into v_harga
    from public.kamar k
    where k.id = new.kamar_id;

    if v_harga is null then
      raise exception 'Kamar tidak ditemukan';
    end if;

    new.status := 'menunggu';
    new.total_harga := v_harga * new.durasi;
    new.alasan_key := null;
    new.alasan_custom := null;
    new.ditolak_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_pemesanan_insert on public.pemesanan;
create trigger trg_enforce_pemesanan_insert
before insert on public.pemesanan
for each row execute function public.enforce_pemesanan_insert();

create or replace function public.enforce_pemesanan_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null
     and not public.is_admin()
     and new.status = 'dikonfirmasi'
     and old.status is distinct from 'dikonfirmasi'
     and coalesce(current_setting('app.pemesanan_rpc', true), '') <> 'on' then
    raise exception 'Konfirmasi pemesanan harus lewat RPC konfirmasi_pemesanan';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_pemesanan_update on public.pemesanan;
create trigger trg_enforce_pemesanan_update
before update on public.pemesanan
for each row execute function public.enforce_pemesanan_update();

-- RPC konfirmasi menandai transaksi agar trigger update mengizinkannya.
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

  perform set_config('app.pemesanan_rpc', 'on', true);

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
