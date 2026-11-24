// Deploy as a Supabase Edge Function and schedule daily in the Supabase Dashboard.
// It offers the earliest FIFO waitlist entry whose requested date is compatible
// with the latest confirmed booking end date, three days before that slot.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addMonths = (date: string, months: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.getUTCDate();
  const targetMonth = d.getUTCMonth() + months;
  d.setUTCMonth(targetMonth, 1); // ≥ 1st of target month; sudah saturation via day clamp
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), targetMonth + 1, 0)).getUTCDate(); // last day of target month (UTC)
  d.setUTCDate(Math.min(day, lastDay));
  return iso(d);
};

Deno.serve(async () => {
  const today = new Date();
  await db.from("waitlist").update({ status: "kedaluwarsa" }).eq("status", "ditawarkan").lt("berlaku_sampai", today.toISOString());
  const { data: rooms } = await db.from("kamar").select("id");
  for (const room of rooms ?? []) {
    const { data: bookings } = await db.from("pemesanan").select("tanggal_mulai,durasi").eq("kamar_id", room.id).eq("status", "dikonfirmasi");
    const lastEnd = (bookings ?? []).map((b) => addMonths(b.tanggal_mulai, b.durasi)).sort().at(-1);
    if (!lastEnd) continue;
    const notifyOn = new Date(`${lastEnd}T00:00:00Z`); notifyOn.setUTCDate(notifyOn.getUTCDate() - 3);
    if (iso(today) < iso(notifyOn)) continue;
    const { data: candidate } = await db.from("waitlist").select("*").eq("kamar_id", room.id).eq("status", "menunggu").order("created_at").limit(1).maybeSingle();
    if (!candidate) continue;
    const slot = candidate.tanggal_mulai > lastEnd ? candidate.tanggal_mulai : lastEnd;
    const expires = new Date(); expires.setHours(expires.getHours() + 48);
    const { error } = await db.from("waitlist").update({ status: "ditawarkan", slot_mulai: slot, ditawarkan_at: today.toISOString(), berlaku_sampai: expires.toISOString() }).eq("id", candidate.id).eq("status", "menunggu");
    if (!error) await db.from("notifikasi").insert({ user_id: candidate.user_id, jenis: "waitlist", judul: "Slot kamar tersedia", isi: `Ajukan booking untuk slot ${slot} dalam 48 jam.`, href: `/pemesanan?kosId=${candidate.kos_id}&waitlistId=${candidate.id}` });
  }
  return Response.json({ ok: true });
});
