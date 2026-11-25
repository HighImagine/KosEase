"use server";

import { createClient } from "@/lib/supabase/server";
import { getNotificationBellData } from "@/lib/db/notification-bell";
import type { NotificationBellData } from "@/lib/db/notification-bell";

// Dipanggil lazy oleh dropdown bell saat pertama kali dibuka.
export async function getNotificationBellDataAction(): Promise<NotificationBellData | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .limit(1);
  const role = (profileData?.[0] as { role?: string } | undefined)?.role ?? null;

  return getNotificationBellData(role, user.id);
}

// Dipanggil dari dropdown bell (client). UI memperbarui state secara optimistik,
// lalu memuat ulang daftar bila aksi gagal.
export async function markNotifikasiReadAction(id: string) {
  if (!id) return { error: "Notifikasi tidak ditemukan" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Harus login terlebih dahulu" };

  const { error } = await supabase
    .from("notifikasi")
    .update({ dibaca_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .is("dibaca_at", null);
  if (error) return { error: error.message };
  return { success: true };
}

export async function markAllNotifikasiReadAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Harus login terlebih dahulu" };

  const { error } = await supabase
    .from("notifikasi")
    .update({ dibaca_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("dibaca_at", null);
  if (error) return { error: error.message };
  return { success: true };
}
