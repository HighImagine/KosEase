-- Cegah eskalasi privilege lewat UPDATE langsung ke profiles.
-- User hanya boleh mengubah full_name/phone/avatar_url. Kolom role, status
-- verifikasi, dan data pengajuan hanya boleh diubah admin atau RPC resmi
-- (submit_pengajuan_pemilik / admin_review_pengajuan_pemilik) yang menandai
-- transaksi dengan app.profile_rpc = 'on'.

create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null
     and not public.is_admin()
     and coalesce(current_setting('app.profile_rpc', true), '') <> 'on' then
    if new.role is distinct from old.role
       or new.status_verifikasi is distinct from old.status_verifikasi
       or new.diverifikasi_oleh is distinct from old.diverifikasi_oleh
       or new.diverifikasi_at is distinct from old.diverifikasi_at
       or new.dokumen_url is distinct from old.dokumen_url
       or new.info_pengajuan is distinct from old.info_pengajuan then
      raise exception 'Kolom profil ini hanya dapat diubah oleh admin';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileged on public.profiles;
create trigger trg_protect_profile_privileged
before update on public.profiles
for each row execute function public.protect_profile_privileged_columns();

-- RPC pengajuan pemilik menulis kolom istimewa atas nama user biasa.
create or replace function public.submit_pengajuan_pemilik(
  p_nama text,
  p_no_hp text,
  p_alamat text,
  p_alasan text,
  p_info_kos text,
  p_dokumen_url text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Harus masuk untuk mengajukan diri';
  end if;

  -- Izinkan trigger profil menerima perubahan kolom verifikasi dari RPC ini.
  perform set_config('app.profile_rpc', 'on', true);

  update public.profiles
  set
    status_verifikasi = 'menunggu_verifikasi',
    dokumen_url = coalesce(p_dokumen_url, dokumen_url),
    info_pengajuan = jsonb_build_object(
      'nama_lengkap', p_nama,
      'no_hp', p_no_hp,
      'alamat', p_alamat,
      'alasan', p_alasan,
      'info_kos', p_info_kos,
      'diajukan_at', now()
    )
  where id = v_uid;

  if not found then
    raise exception 'Profil pengguna tidak ditemukan';
  end if;
end;
$$;
